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
exports.IndexRouter = void 0;
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const requestHandler_1 = require("../utils/requestHandler/requestHandler");
const boardService_1 = require("../services/boardService");
const fileUpload_1 = require("../services/fileUpload");
const errorMessage_1 = require("../consts/errorMessage");
const sequelize_1 = require("../utils/sequelize/sequelize");
const users_1 = require("../models/users");
const board_1 = require("../models/board");
exports.IndexRouter = express_1.default.Router();
exports.IndexRouter.get("/", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        res.render("index", { layout: false });
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const posts = yield boardService_1.FindFullLists(Number(myInformation.userId));
    return res.render("board/full_list", {
        myinfo: {
            username: req.userinfo.username,
            name: myInformation.name,
            comment: myInformation.comment,
            email: myInformation.email,
            picture: myInformation.picture
        },
        posts: posts,
    });
})));
exports.IndexRouter.get("/:id", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    if (!targetInformation.isFind || !targetInformation.userId) {
        return res.redirect("/");
    }
    const count = yield boardService_1.CountOfPosts(targetInformation.userId);
    const posts = yield boardService_1.FindPosts(targetInformation.userId);
    return res.render("board/list", {
        myinfo: {
            username: req.userinfo.username,
            name: myInformation.name,
            comment: myInformation.comment,
            email: myInformation.email,
            picture: myInformation.picture
        },
        targetinfo: {
            username: targetInformation.username,
            name: targetInformation.name,
            comment: targetInformation.comment,
            email: targetInformation.email,
            picture: targetInformation.picture
        },
        count: count.count,
        posts: posts,
    });
})));
exports.IndexRouter.post("/:id/:post([0-9]{1,10})/comment", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    const boardId = req.params.post;
    const commentText = req.body.CommentText;
    if (!targetInformation.isFind || !targetInformation.userId || !boardId) {
        return res.redirect("/");
    }
    yield boardService_1.WriteComment(Number(myInformation.userId), Number(boardId), "plus", commentText);
    return res.redirect(`/${req.params.id}/${req.params.post}`);
})));
exports.IndexRouter.get("/:id/:post([0-9]{1,10})/delete", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    const boardId = req.params.post;
    if (!targetInformation.isFind || !targetInformation.userId || !boardId || myInformation.username !== req.params.id) {
        return res.redirect("/");
    }
    return res.render("board/delete", {
        myinfo: {
            username: req.userinfo.username,
            name: myInformation.name,
            comment: myInformation.comment,
            email: myInformation.email,
            picture: myInformation.picture
        },
        targetinfo: {
            username: targetInformation.username,
            name: targetInformation.name,
            comment: targetInformation.comment,
            email: targetInformation.email,
            picture: targetInformation.picture
        },
        post: req.params.post,
    });
})));
exports.IndexRouter.post("/:id/:post([0-9]{1,10})/delete", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    const boardId = req.params.post;
    if (!targetInformation.isFind || !targetInformation.userId || !boardId || myInformation.username !== req.params.id) {
        return res.redirect("/");
    }
    const deletePost = yield boardService_1.DeletePost(targetInformation.userId, Number(boardId));
    return res.render("board/result", {
        myinfo: {
            username: req.userinfo.username,
            name: myInformation.name,
            comment: myInformation.comment,
            email: myInformation.email,
            picture: myInformation.picture
        },
        Msg: deletePost.msg,
    });
})));
exports.IndexRouter.get("/:id/:post([0-9]{1,10})/addMyLike", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    const boardId = req.params.post;
    if (!targetInformation.isFind || !targetInformation.userId || !boardId) {
        return res.redirect("/");
    }
    yield boardService_1.AddMyLikes(Number(myInformation.userId), Number(boardId));
    res.redirect(`/${req.params.id}/${req.params.post}`);
})));
exports.IndexRouter.get("/:id/:post([0-9]{1,10})/removeMyLike", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    const boardId = req.params.post;
    if (!targetInformation.isFind || !targetInformation.userId || !boardId) {
        return res.redirect("/");
    }
    yield boardService_1.RemoveMyLikes(Number(myInformation.userId), Number(boardId));
    res.redirect(`/${req.params.id}/${req.params.post}`);
})));
exports.IndexRouter.get("/:id/:post([0-9]{1,10})", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const myInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const targetInformation = yield userService_1.FindUserInfo(req.params.id);
    if (!targetInformation.isFind || !targetInformation.userId) {
        return res.redirect("/");
    }
    const posts = yield boardService_1.ViewPost(req.params.id, Number(req.params.post), Number(myInformation.userId));
    const comments = yield boardService_1.ViewComment(req.params.id, Number(req.params.post));
    if (!posts.isPost) {
        return res.render("board/error", {
            myinfo: {
                username: req.userinfo.username,
                name: myInformation.name,
                comment: myInformation.comment,
                email: myInformation.email,
                picture: myInformation.picture
            },
            Msg: posts.msg,
        });
    }
    return res.render("board/read", {
        myinfo: {
            username: req.userinfo.username,
            name: myInformation.name,
            comment: myInformation.comment,
            email: myInformation.email,
            picture: myInformation.picture
        },
        targetinfo: {
            username: targetInformation.username,
            name: targetInformation.name,
            comment: targetInformation.comment,
            email: targetInformation.email,
            picture: targetInformation.picture
        },
        post: req.params.post,
        posts: posts,
        comments: comments
    });
})));
exports.IndexRouter.get("/:id/write", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    return res.render("board/write", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    });
})));
exports.IndexRouter.post("/:id/write", userService_1.Auth, fileUpload_1.BoardPicUpload.single("writePic"), requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const { writeText } = req.body;
    if (!req.file || !writeText) {
        return res.render("board/write", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            msg: errorMessage_1.ErrorMsg.NotInputValue
        });
    }
    const boardWrite = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
            where: {
                username: req.userinfo.username
            },
            transaction: t
        });
        if (!user) {
            return {
                isWrite: false,
                msg: "회원 정보가 없습니다. 다시 시도해주세요."
            };
        }
        const board = yield board_1.Board.create({
            contents: writeText,
            file: req.file.filename,
            likes: 0,
            replies: 0,
            userId: user.id
        }, {
            transaction: t
        });
        yield board.save({
            transaction: t
        });
        boardService_1.ChangePostCount(user.id, "plus");
        return {
            isWrite: true
        };
    }));
    if (boardWrite.isWrite) {
        return res.redirect("/");
    }
    else {
        return res.render("board/write", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: req.file.filename
            },
            Msg: boardWrite.msg
        });
    }
})));
//# sourceMappingURL=indexRoutes.js.map