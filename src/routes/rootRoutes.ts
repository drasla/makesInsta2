import express from "express";
import {Auth, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";

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
