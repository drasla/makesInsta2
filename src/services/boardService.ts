import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {UserInfo} from "../models/userInfo";
import {Board} from "../models/board";
import {ErrorMsg} from "../consts/errorMessage";
import {Users} from "../models/users";
import {BoardReplies} from "../models/boardReplies";

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

export const FindPosts = async (userId: number) => {
    const posts = await SequelizeUtil.db.transaction<{
        isPost: boolean,
        data?: object,
        count?: number
        msg?: string
    }>(async t=> {
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

export const PlusPostCount = async (userId: number) => {
    const plus = await SequelizeUtil.db.transaction<{
        isPlus: boolean
    }>(async t => {
        const prevCount = await CountOfPosts(userId);
        if (prevCount.count) {
            await UserInfo.update({
                    posts: prevCount.count + 1
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

        if (prevCount.count) {
            if (type === "plus") {
                var resultCount = prevCount.count + 1;
            } else {
                var resultCount = prevCount.count - 1;
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

        await ChangeCommentCount(boardId, type);

        await comment.save({
            transaction: t
        })

        return {
            isWrite: true
        }
    })

    return commentWrite;
}
