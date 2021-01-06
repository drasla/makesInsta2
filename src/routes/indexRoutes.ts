import express from "express";
import {Auth, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";
import {
    ChangePostCount,
    CountOfPosts,
    DeletePost, FindFullLists,
    FindPosts,
    ViewComment,
    ViewPost,
    WriteComment
} from "../services/boardService";
import {BoardPicUpload} from "../services/fileUpload";
import {ErrorMsg} from "../consts/errorMessage";
import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {Users} from "../models/users";
import {Board} from "../models/board";

export const IndexRouter = express.Router();

IndexRouter.get("/", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        res.render("index", { layout: false });
    }

    const myInformation = await FindUserInfo(req.userinfo.username);

    const posts: object = await FindFullLists();

    return res.render("board/full_list", {
        myinfo: {
            username: req.userinfo.username,
            name: myInformation.name,
            comment: myInformation.comment,
            email: myInformation.email,
            picture: myInformation.picture
        },
        posts: posts,
    })
}));

IndexRouter.get("/:id", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const myInformation = await FindUserInfo(req.userinfo.username);

    const targetInformation = await FindUserInfo(req.params.id);

    if (!targetInformation.isFind || !targetInformation.userId) {
        return res.redirect("/");
    }

    const count = await CountOfPosts(targetInformation.userId);

    const posts: object = await FindPosts(targetInformation.userId);

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
    })
}))

IndexRouter.post("/:id/:post([0-9]{1,10})/comment", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const myInformation = await FindUserInfo(req.userinfo.username);

    const targetInformation = await FindUserInfo(req.params.id);

    const boardId = req.params.post;

    const commentText = req.body.CommentText;

    if (!targetInformation.isFind || !targetInformation.userId || !boardId) {
        return res.redirect("/");
    }

    await WriteComment(targetInformation.userId, Number(boardId), "plus", commentText);

    return res.redirect(`/${req.params.id}/${req.params.post}`);
}));

IndexRouter.get("/:id/:post([0-9]{1,10})/delete", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const myInformation = await FindUserInfo(req.userinfo.username);

    const targetInformation = await FindUserInfo(req.params.id);

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
    })
}));

IndexRouter.post("/:id/:post([0-9]{1,10})/delete", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const myInformation = await FindUserInfo(req.userinfo.username);

    const targetInformation = await FindUserInfo(req.params.id);

    const boardId = req.params.post;

    if (!targetInformation.isFind || !targetInformation.userId || !boardId || myInformation.username !== req.params.id) {
        return res.redirect("/");
    }

    const deletePost = await DeletePost(targetInformation.userId, Number(boardId));

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
}));

IndexRouter.get("/:id/:post([0-9]{1,10})", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const myInformation = await FindUserInfo(req.userinfo.username);

    const targetInformation = await FindUserInfo(req.params.id);

    if (!targetInformation.isFind || !targetInformation.userId) {
        return res.redirect("/");
    }

    const posts = await ViewPost(req.params.id, Number(req.params.post));

    const comments = await ViewComment(req.params.id, Number(req.params.post));

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
        })
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
    })
}));


IndexRouter.get("/:id/write", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    return res.render("board/write", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    })
}))

IndexRouter.post("/:id/write", Auth, BoardPicUpload.single("writePic"), WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    const {writeText} = req.body;
    if(!req.file || !writeText) {
        return res.render("board/write", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            msg: ErrorMsg.NotInputValue
        })
    }

    const boardWrite = await SequelizeUtil.db.transaction<{
        isWrite: boolean,
        msg?: string
    }>(async t => {
        const user = await Users.findOne<Users>({
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

        const board = await Board.create({
                contents: writeText,
                file: req.file.filename,
                likes: 0,
                replies: 0,
                userId: user.id
            },
            {
                transaction: t
            })

        await board.save({
            transaction: t
        });

        ChangePostCount(user.id, "plus");

        return {
            isWrite: true
        }
    });


    if (boardWrite.isWrite) {
        return res.redirect("/");
    } else {
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
}));
