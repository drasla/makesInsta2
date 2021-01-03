import express from "express";
import {Auth, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";
import {CountOfPosts, FindPosts, PlusPostCount, ViewPost} from "../services/boardService";
import {BoardPicUpload} from "../services/fileUpload";
import {ErrorMsg} from "../consts/errorMessage";
import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {Users} from "../models/users";
import {Board} from "../models/board";

export const IndexRouter = express.Router();

IndexRouter.get("/", Auth, WrapHandler(async (req, res) => {
    if(req.userinfo) {
        const userInformation = await FindUserInfo(req.userinfo.username);
        res.render("board/full_list", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
        })
    } else {
        res.render("index", { layout: false });
    }
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
        posts: posts,
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

        const plus = PlusPostCount(user.id);

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
