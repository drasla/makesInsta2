"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveMyLikes = exports.AddMyLikes = exports.DeletePost = exports.WriteComment = exports.ChangeLikesCount = exports.ChangeCommentCount = exports.ChangePostCount = exports.ViewComment = exports.ViewPost = exports.FindPosts = exports.FindFullLists = exports.CountOfLikes = exports.CountOfComments = exports.CountOfPosts = void 0;
const sequelize_1 = require("../utils/sequelize/sequelize");
const userInfo_1 = require("../models/userInfo");
const board_1 = require("../models/board");
const errorMessage_1 = require("../consts/errorMessage");
const users_1 = require("../models/users");
const boardReplies_1 = require("../models/boardReplies");
const boardLikes_1 = require("../models/boardLikes");
const fs_1 = __importDefault(require("fs"));
const sequelize_typescript_1 = require("sequelize-typescript");
exports.CountOfPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const userInfo = yield userInfo_1.UserInfo.findOne({
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
        };
    }));
    return count;
});
exports.CountOfComments = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const board = yield board_1.Board.findOne({
            where: {
                id: boardId
            },
            transaction: t
        });
        if (!board) {
            return {
                isCount: false
            };
        }
        else {
            return {
                isCount: true,
                count: board.replies
            };
        }
    }));
    return count;
});
exports.CountOfLikes = (boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const board = yield board_1.Board.findOne({
            where: {
                id: boardId
            },
            transaction: t
        });
        if (!board) {
            return {
                isCount: false
            };
        }
        else {
            return {
                isCount: true,
                count: board.likes
            };
        }
    }));
    return count;
});
exports.FindFullLists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const board = yield board_1.Board.findAll({
            subQuery: false,
            attributes: {
                include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(id) from BoardLikes where boardNumber = Board.id AND userId=${userId})`), "myLike"]
                ]
            },
            order: [
                ["id", "desc"]
            ],
            include: [
                {
                    model: users_1.Users,
                    include: [
                        {
                            model: userInfo_1.UserInfo
                        }
                    ],
                },
                {
                    model: boardReplies_1.BoardReplies,
                    subQuery: false,
                    include: [
                        {
                            model: users_1.Users,
                            include: [
                                {
                                    model: userInfo_1.UserInfo
                                }
                            ],
                        }
                    ],
                    order: [
                        ["createdAt", "desc"]
                    ],
                    limit: 2,
                },
                {
                    model: boardLikes_1.BoardLikes,
                    subQuery: false,
                    limit: 1,
                    order: [
                        ["createdAt", "desc"]
                    ],
                    include: [
                        {
                            model: users_1.Users,
                            include: [
                                {
                                    model: userInfo_1.UserInfo
                                }
                            ]
                        }
                    ]
                }
            ],
            transaction: t
        });
        if (!board) {
            return {
                isPost: false,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts
            };
        }
        return {
            isPost: true,
            data: board,
        };
    }));
    return posts;
});
exports.FindPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const board = yield board_1.Board.findAll({
            where: {
                userId: userId
            },
            order: [
                ["id", "desc"]
            ],
            transaction: t
        });
        const boardCount = yield board_1.Board.count({
            where: {
                userId: userId
            },
            transaction: t
        });
        if (!board) {
            return {
                isPost: false,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts,
            };
        }
        return {
            isPost: true,
            data: board,
            count: boardCount
        };
    }));
    return posts;
});
exports.ViewPost = (username, boardId, myUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
            where: {
                username: username
            },
            transaction: t
        });
        if (!user) {
            return {
                isPost: false,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts,
            };
        }
        const board = yield board_1.Board.findOne({
            where: {
                id: boardId,
                userId: user.id
            },
            attributes: {
                include: [
                    [sequelize_typescript_1.Sequelize.literal(`(SELECT COUNT(id) from BoardLikes where boardNumber = Board.id AND userId=${myUserId})`), "myLike"]
                ]
            },
            include: [
                {
                    model: users_1.Users,
                    include: [
                        {
                            model: userInfo_1.UserInfo
                        }
                    ],
                },
                {
                    model: boardReplies_1.BoardReplies,
                    subQuery: false,
                    include: [
                        {
                            model: users_1.Users,
                            include: [
                                {
                                    model: userInfo_1.UserInfo
                                }
                            ],
                        }
                    ],
                    order: [
                        ["createdAt", "desc"]
                    ],
                },
                {
                    model: boardLikes_1.BoardLikes,
                    subQuery: false,
                    limit: 1,
                    order: [
                        ["createdAt", "desc"]
                    ],
                    include: [
                        {
                            model: users_1.Users,
                            include: [
                                {
                                    model: userInfo_1.UserInfo
                                }
                            ]
                        }
                    ]
                }
            ],
            transaction: t
        });
        if (!board) {
            return {
                isPost: false,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts,
            };
        }
        return {
            isPost: true,
            data: board,
            userinfo: user
        };
    }));
    return post;
});
exports.ViewComment = (username, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
            where: {
                username: username
            },
            transaction: t
        });
        if (!user) {
            return {
                isComment: false,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts,
            };
        }
        const board = yield boardReplies_1.BoardReplies.findAll({
            where: {
                boardNumber: boardId
            },
            order: [
                ["createdAt", "desc"]
            ],
            include: [
                {
                    model: users_1.Users
                }
            ],
            transaction: t
        });
        if (!board) {
            return {
                isComment: false,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts,
            };
        }
        return {
            isComment: true,
            data: board
        };
    }));
    return comment;
});
exports.ChangePostCount = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const plus = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const prevCount = yield exports.CountOfPosts(userId);
        if (prevCount.isCount) {
            if (type === "plus") {
                var resultCount = Number(prevCount.count) + 1;
            }
            else if (type === "minus") {
                var resultCount = Number(prevCount.count) - 1;
            }
            else {
                var resultCount = Number(prevCount.count);
            }
            yield userInfo_1.UserInfo.update({
                posts: resultCount
            }, {
                where: {
                    userId: userId
                },
                transaction: t
            });
            return {
                isPlus: true
            };
        }
        else {
            return {
                isPlus: false
            };
        }
    }));
    return plus;
});
exports.ChangeCommentCount = (boardId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const plus = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const prevCount = yield exports.CountOfComments(boardId);
        if (prevCount.isCount) {
            if (type === "plus") {
                var resultCount = Number(prevCount.count) + 1;
            }
            else {
                var resultCount = Number(prevCount.count) - 1;
            }
            yield board_1.Board.update({
                replies: resultCount
            }, {
                where: {
                    id: boardId
                },
                transaction: t
            });
            return {
                isPlus: true
            };
        }
        else {
            return {
                isPlus: false
            };
        }
    }));
    return plus;
});
exports.ChangeLikesCount = (boardId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const plus = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const prevCount = yield exports.CountOfLikes(boardId);
        if (prevCount.isCount) {
            if (type === "plus") {
                var resultCount = Number(prevCount.count) + 1;
            }
            else {
                var resultCount = Number(prevCount.count) - 1;
            }
            yield board_1.Board.update({
                likes: resultCount
            }, {
                where: {
                    id: boardId
                },
                transaction: t
            });
            return {
                isPlus: true
            };
        }
        else {
            return {
                isPlus: false
            };
        }
    }));
    return plus;
});
exports.WriteComment = (userId, boardId, type, contents) => __awaiter(void 0, void 0, void 0, function* () {
    const commentWrite = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const comment = yield boardReplies_1.BoardReplies.create({
            boardNumber: boardId,
            userId: userId,
            contents: contents,
        }, {
            transaction: t
        });
        const prevCount = yield exports.CountOfComments(boardId);
        if (prevCount.isCount) {
            var resultCount = Number(prevCount.count) + 1;
            yield board_1.Board.update({
                replies: resultCount
            }, {
                where: {
                    id: boardId
                },
                transaction: t
            });
        }
        yield comment.save({
            transaction: t
        });
        return {
            isWrite: true
        };
    }));
    return commentWrite;
});
exports.DeletePost = (targetUserId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePost = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const findBoard = yield board_1.Board.findOne({
            where: {
                id: boardId
            },
            transaction: t
        });
        if (!findBoard) {
            return {
                isDelete: false,
                boardId: boardId,
                msg: errorMessage_1.ErrorMsg.NotFoundPosts
            };
        }
        yield board_1.Board.destroy({
            where: {
                id: boardId
            },
            transaction: t
        });
        yield boardReplies_1.BoardReplies.destroy({
            where: {
                boardNumber: boardId
            },
            transaction: t
        });
        yield boardLikes_1.BoardLikes.destroy({
            where: {
                boardNumber: boardId
            },
            transaction: t
        });
        if (findBoard.file !== "") {
            fs_1.default.unlinkSync('public/image/boardpic/' + findBoard.file);
        }
        const prevCount = yield exports.CountOfPosts(targetUserId);
        if (prevCount.isCount) {
            var resultCount = Number(prevCount.count) - 1;
            yield userInfo_1.UserInfo.update({
                posts: resultCount
            }, {
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
        };
    }));
    return deletePost;
});
exports.AddMyLikes = (userId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const addLikes = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const like = yield boardLikes_1.BoardLikes.create({
            boardNumber: boardId,
            userId: userId,
        }, {
            transaction: t
        });
        const prevCount = yield exports.CountOfLikes(boardId);
        if (prevCount.isCount) {
            var resultCount = Number(prevCount.count) + 1;
            yield board_1.Board.update({
                likes: resultCount
            }, {
                where: {
                    id: boardId
                },
                transaction: t
            });
        }
        yield like.save({
            transaction: t
        });
        return {
            isAdd: true
        };
    }));
    return addLikes;
});
exports.RemoveMyLikes = (userId, boardId) => __awaiter(void 0, void 0, void 0, function* () {
    const removeLikes = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        yield boardLikes_1.BoardLikes.destroy({
            where: {
                boardNumber: boardId,
                userId: userId,
            },
            transaction: t
        });
        const prevCount = yield exports.CountOfLikes(boardId);
        if (prevCount.isCount) {
            var resultCount = Number(prevCount.count) - 1;
            yield board_1.Board.update({
                likes: resultCount
            }, {
                where: {
                    id: boardId
                },
                transaction: t
            });
        }
        return {
            isRemove: true
        };
    }));
    return removeLikes;
});
//# sourceMappingURL=boardService.js.map