import express from "express";
import { ErrorMsg } from "../consts/errorMessage";
import {Auth, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";
import {BoardPicUpload} from "../services/fileUpload";
import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {Users} from "../models/users";
import {Board} from "../models/board";

export const BoardRouter = express.Router();

BoardRouter.get('/:boardNum([0-9]{1,10})', Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);



    res.render("board/read", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    })
}));

BoardRouter.get("/write", Auth, WrapHandler(async (req, res) => {
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

BoardRouter.post("/write", Auth, BoardPicUpload.single("writePic"), WrapHandler(async (req, res) => {
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

BoardRouter.get("/", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("board/list", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    })
}));
