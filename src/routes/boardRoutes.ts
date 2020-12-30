import express from "express";
import {Auth, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";

export const BoardRouter = express.Router();

BoardRouter.get("/", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("board/list", {
        "username": req.userinfo.username,
        "name": userInformation.name,
        "comment": userInformation.comment,
        "picture": userInformation.picture
    })
}));

BoardRouter.get("/write", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("board/write", {
        "username": req.userinfo.username,
        "name": userInformation.name,
        "comment": userInformation.comment,
        "picture": userInformation.picture
    })
}))
