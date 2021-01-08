import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {UserInfo} from "../models/userInfo";
import {Board} from "../models/board";
import {ErrorMsg} from "../consts/errorMessage";
import {Users} from "../models/users";
import {BoardReplies} from "../models/boardReplies";
import {BoardLikes} from "../models/boardLikes";
import fs from "fs";

export const CountOfPosts = async (userId: number) => {
    const count = await SequelizeUtil.db.transaction<{
        isCount: boolean,
        count?: number,
        msg?: string
    }>(async t => {
        const userInfo = await UserInfo.findOne<UserInfo>({
            where: {
                userId: userId
            },
            transaction: t
        });

        if (!userInfo) {
            return {
                isCount: false
            };
        }

        return {
            isCount: true,
            count: userInfo.posts
        }
    })
    return count;
}

export const CountOfComments = async (boardId: number) => {
    const count = await SequelizeUtil.db.transaction<{
        isCount: boolean,
        count?: number
    }>(async t => {
        const board = await Board.findOne<Board>({
            where: {
                id: boardId
            },
            transaction: t
        });

        if (!board) {
            return {
                isCount: false
            }
        } else {
            return {
                isCount: true,
                count: board.replies
            }
        }
    })
    return count;
}

export const FindFullLists = async () => {
    const posts = await SequelizeUtil.db.transaction<{
        isPost: boolean,
        data?: object,
        msg?: string
    }>(async t => {
        const board = await Board.findAll<Board>({
            subQuery: false,
            order: [
                ["id", "desc"]
            ],
            include: [
                {
                    model: Users,
                    include: [
                        {
                            model: UserInfo
                        }
                    ],
                },
                {
                    model: BoardReplies,
                    subQuery: false,
                    include: [
                        {
                            model: Users,
                            include: [
                                {
                                    model: UserInfo
                                }
                            ],
                        }
                    ],
                    order: [
                        ["createdAt", "desc"]
                    ],
                    limit: 2,
                }
            ],
            transaction: t
        });

        if(!board) {
            return {
                isPost: false,
                msg: ErrorMsg.NotFoundPosts
            };
        }

        return {
            isPost: true,
            data: board
        }
    })

    return posts;
}


export const FindPosts = async (userId: number) => {
    const posts = await SequelizeUtil.db.transaction<{
        isPost: boolean,
        data?: object,
        count?: number,
        msg?: string
    }>(async t => {
        const board = await Board.findAll<Board>({
            where: {
                userId: userId
            },
            order: [
                ["id", "desc"]
            ],
            transaction: t
        });


        const boardCount = await Board.count({
            where: {
                userId: userId
            },
            transaction: t
        })

        if(!board) {
            return {
                isPost: false,
                msg: ErrorMsg.NotFoundPosts,
            }
        }

        return {
            isPost: true,
            data: board,
            count: boardCount
        }
    })

    return posts;
}

export const ViewPost = async (username: string, boardId: number) => {
    const post = await SequelizeUtil.db.transaction<{
        isPost: boolean,
        data?: object,
        userinfo?: object,
        msg?: string
    }>(async t=> {
        const user = await Users.findOne<Users>({
            where: {
                username: username
            },
            transaction: t
        })

        if(!user) {
            return {
                isPost: false,
                msg: ErrorMsg.NotFoundPosts,
            }
        }

        const board = await Board.findOne<Board>({
            where: {
                id: boardId,
                userId: user.id
            },
            transaction: t
        });

        if(!board) {
            return {
                isPost: false,
                msg: ErrorMsg.NotFoundPosts,
            }
        }

        return {
            isPost: true,
            data: board,
            userinfo: user
        }
    })

    return post;
}

export const ViewComment = async (username: string, boardId: number) => {
    const comment = await SequelizeUtil.db.transaction<{
        isComment: boolean,
        data?: object,
        userinfo?: object,
        msg?: string
    }>(async t=> {
        const user = await Users.findOne<Users>({
            where: {
                username: username
            },
            transaction: t
        })

        if(!user) {
            return {
                isComment: false,
                msg: ErrorMsg.NotFoundPosts,
            }
        }

        const board = await BoardReplies.findAll<BoardReplies>({
            where: {
                boardNumber: boardId
            },
            order: [
                ["createdAt", "desc"]
            ],
            include: [
                {
                    model: Users
                }
            ],
            transaction: t
        });

        if(!board) {
            return {
                isComment: false,
                msg: ErrorMsg.NotFoundPosts,
            }
        }

        return {
            isComment: true,
            data: board
        }
    })

    return comment;
}

export const ChangePostCount = async (userId: number, type: string) => {
    const plus = await SequelizeUtil.db.transaction<{
        isPlus: boolean
    }>(async t => {
        const prevCount = await CountOfPosts(userId);
        if (prevCount.isCount) {
            if (type === "plus") {
                var resultCount = Number(prevCount.count) + 1;
            } else if(type === "minus") {
                var resultCount = Number(prevCount.count) - 1;
            } else {
                var resultCount = Number(prevCount.count);
            }
            await UserInfo.update({
                    posts: resultCount
                },
                {
                    where: {
                        userId: userId
                    },
                    transaction: t
                });

            return {
                isPlus: true
            }
        } else {
            return {
                isPlus: false
            }
        }
    })
    return plus;
}

export const ChangeCommentCount = async (boardId: number, type: string) => {
    const plus = await SequelizeUtil.db.transaction<{
        isPlus: boolean
    }>(async t => {
        const prevCount = await CountOfComments(boardId);

        if (prevCount.isCount) {
            if (type === "plus") {
                var resultCount = Number(prevCount.count) + 1;
            } else {
                var resultCount = Number(prevCount.count) - 1;
            }

            await Board.update({
                    replies: resultCount
                },
                {
                    where: {
                        id: boardId
                    },
                    transaction: t
                });

            return {
                isPlus: true
            }
        } else {
            return {
                isPlus: false
            }
        }
    })
    return plus;
}

export const WriteComment = async (targetUserId: number, boardId: number, type: string, contents?: string) => {
    const commentWrite = await SequelizeUtil.db.transaction<{
        isWrite: boolean
    }>(async t => {
        const comment = await BoardReplies.create({
            boardNumber: boardId,
            userId: targetUserId,
            contents: contents,
            },
            {
                transaction: t
            });

        //await ChangeCommentCount(boardId, type);
        const prevCount = await CountOfComments(boardId);

        if (prevCount.isCount) {
            var resultCount = Number(prevCount.count) + 1;

            await Board.update({
                    replies: resultCount
                },
                {
                    where: {
                        id: boardId
                    },
                    transaction: t
                });
        }

        await comment.save({
            transaction: t
        })

        return {
            isWrite: true
        }
    })

    return commentWrite;
}

export const DeletePost = async (targetUserId: number, boardId: number) => {
    const deletePost = await SequelizeUtil.db.transaction<{
        isDelete: boolean,
        boardId: number,
        msg: string
    }>(async t => {
        const findBoard = await Board.findOne<Board>({
            where: {
                id: boardId
            },
            transaction: t
        });

        if (!findBoard) {
            return {
                isDelete: false,
                boardId: boardId,
                msg: ErrorMsg.NotFoundPosts
            }
        }

        await Board.destroy({
            where: {
                id: boardId
            },
            transaction: t
        });

        await BoardReplies.destroy({
            where: {
                boardNumber: boardId
            },
            transaction: t
        });

        await BoardLikes.destroy({
            where: {
                boardNumber: boardId
            },
            transaction: t
        })

        if(findBoard.file !== "") {
            fs.unlinkSync('public/image/boardpic/' + findBoard.file);
        }

        const prevCount = await CountOfPosts(targetUserId);
        if (prevCount.isCount) {

            var resultCount = Number(prevCount.count) - 1;

            await UserInfo.update({
                    posts: resultCount
                },
                {
                    where: {
                        userId: targetUserId
                    },
                    transaction: t
                });
        }

        return {
            isDelete: true,
            boardId: boardId,
            msg: "게시글 삭제가 완료되었습니다."
        }
    })

    return deletePost;
}
