import express from "express";
import {Auth, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";

export const BoardReadRouter = express.Router();

BoardReadRouter.get('/', Auth, WrapHandler(async (req, res) => {
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
