import express from "express";
import {Auth, CreateToken, FindUserInfo} from "../services/userService";
import {WrapHandler} from "../utils/requestHandler/requestHandler";
import {Users} from "../models/users";
import {ErrorMsg} from "../consts/errorMessage";
import {UserInfo} from "../models/userInfo";
import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {CookieID} from "../consts/const";
import fs from "fs";
import {UserpicUpload} from "../services/fileUpload";

export const UserRouter = express.Router();

UserRouter.get("/", Auth, (req, res) => {
    if(req.userinfo) {
        res.redirect("/user/edit");
    } else {
        res.redirect("/user/login");
    }
});

UserRouter.get("/login", Auth, (req, res) => {
    if(req.userinfo) {
        res.redirect(`${req.userinfo.username}/`);
    } else {
        res.render("index", { layout: false })
    }
});

UserRouter.post("/login", Auth, WrapHandler(async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.render("index", { "Msg": ErrorMsg.NotInputValue, layout: false })
    }
    const login = await SequelizeUtil.db.transaction<{
        isLogin: boolean,
        username?: string,
        token?: string,
        msg?: string
    }>(async t => {
        if (!process.env.JWT_SECRET) {
            return {
                isLogin: false,
                msg: "토큰이 잘못되었습니다. 관리자에게 문의하세요."
            }
        }

        const user = await Users.findOne<Users>({
            where: {
                username: username
            },
            transaction: t
        });

        if (!user) {
            return {
                isLogin: false,
                msg: ErrorMsg.NotFoundUser
            }
        }

        const userInfo = await UserInfo.findOne<UserInfo>({
            where: {
                userId: user.userInfoId,
                pw: password
            },
            transaction: t
        });

        if (!userInfo) {
            return {
                isLogin: false,
                msg: ErrorMsg.PasswordNotCorrect
            };
        }

        const token = CreateToken(user.id, username, userInfo.nm);

        res.cookie(CookieID, token.token, {
            expires: token.time
        });

        return {
            isLogin: true,
            username: user.username,
            token: token.token
        }
    })
    if (login.isLogin) {
        res.redirect(`/${login.username}/`)
    } else {
        res.render("index", { "Msg": login.msg, layout: false })
    }
}))

UserRouter.get("/join", Auth, (req, res) => {
    if(req.userinfo) {
        res.redirect(`${req.userinfo.username}/`);
    } else {
        res.render("user/join", { layout: false })
    }
})

UserRouter.post("/join", WrapHandler(async (req, res) => {
    const {username, password, email, name} = req.body;

    if (!username || !password || !email || !name) {
        return res.render("user/join", {Msg: ErrorMsg.NotInputValue, layout: false});
    }

    const join = await SequelizeUtil.db.transaction<{
        isJoin: Boolean,
        username?: string,
        token?: string,
        msg?: string
    }>(async t => {
        if (!process.env.JWT_SECRET) {
            return {
                isJoin: false,
                msg: ErrorMsg.NotFoundToken
            }
        }

        const findUser = await Users.findOne<Users>({
            where: {
                username: username
            }
        })

        if(findUser) {
            return {
                isJoin: false,
                msg: ErrorMsg.FoundUser
            };
        }

        const findUserInfo = await UserInfo.findOne<UserInfo>({
            where: {
                email: email
            }
        })
        if(findUserInfo) {
            return {
                isJoin: false,
                msg: ErrorMsg.FoundEmail
            }
        }

        const user = await Users.create({
                username: username
            },
            {
                transaction: t
            }
        );

        const userInfo = await UserInfo.create({
                userId: user.id,
                nm: name,
                pw: password,
                email: email
            },
            {
                transaction: t
            }
        );
        user.userInfoId = userInfo.id;

        await user.save({
            transaction: t
        });

        const token = CreateToken(user.id, username, userInfo.nm);

        res.cookie(CookieID, token.token, {
            expires: token.time
        });

        return {
            isJoin: true,
            username: user.username,
            token: token.token
        }
    });

    if (join.isJoin) {
        res.render("user/success", {layout: false});
    } else {
        res.render("user/join", {Msg: join.msg, layout: false});
    }
}));

UserRouter.get("/logout", (req, res) => {
    res.clearCookie(CookieID);

    if (!req.cookies.LoginSessionId) {
        return res.redirect("/");
    }

    if (req.session) {
        req.session.destroy(() => {
            req.session;
        });
    }
    res.clearCookie("LoginSessionId", {
        path: '/',
        expire: 0
    });

    res.redirect("/");
})

UserRouter.get("/edit", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("user/edit", {
        "username": req.userinfo.username,
        "name": userInformation.name,
        "comment": userInformation.comment,
        "picture": userInformation.picture,
        "email": userInformation.email
    })
}));

UserRouter.post("/edit", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const {name, comment, email} = req.body;

    const userInformation = await FindUserInfo(req.userinfo.username);

    if(!name || !comment || !email) {
        return res.render("user/edit", {
            "username": req.userinfo.username,
            "name": userInformation.name,
            "comment": userInformation.comment,
            "picture": userInformation.picture,
            "email": userInformation.email,
            Msg: ErrorMsg.NotInputValue
        });

    }

    const update = await SequelizeUtil.db.transaction<{
        isUpdate: boolean,
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
                isUpdate: false,
                msg: "회원 정보가 없습니다. 다시 시도해주세요."
            };
        }

        const findEmail = await UserInfo.findAll<UserInfo>({
            where: {
                email: email
            },
            transaction: t
        })

        if(1 < findEmail.length) {
            return {
                isUpdate: false,
                msg: ErrorMsg.FoundEmail
            }
        }

        await UserInfo.update({
                nm: name,
                email: email,
                comment: comment
            },
            {
                where: {
                    userId: user.userInfoId
                },
                transaction: t
            });

        return {
            isUpdate: true,
            msg: ErrorMsg.EditUpdateOK
        };
    });

    res.render("user/result", {
        "username": req.userinfo.username,
        "picture": userInformation.picture,
        "Msg": update.msg
    });
}));

UserRouter.get("/edit/picture/change", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("user/pictureChange", {
        "username": req.userinfo.username,
        "name": userInformation.name,
        "comment": userInformation.comment,
        "picture": userInformation.picture,
        "email": userInformation.email
    })
}));

UserRouter.post("/edit/picture/change", Auth, UserpicUpload.single("changePic"), WrapHandler(async (req, res) =>  {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    if(!req.file) {
        return res.render("user/edit", {
            "username": req.userinfo.username,
            "name": userInformation.name,
            "comment": userInformation.comment,
            "picture": userInformation.picture,
            "email": userInformation.email,
            Msg: ErrorMsg.NotInputValue
        });
    }

    const userpicUpdate = await SequelizeUtil.db.transaction<{
        isUpdate: boolean,
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
                isUpdate: false,
                msg: "회원 정보가 없습니다. 다시 시도해주세요."
            };
        }
        if (userInformation.picture !== "") {
            fs.unlinkSync('public/image/userpic/' + userInformation.picture);
        }

        await UserInfo.update({
                picture: req.file.filename
            },
            {
                where: {
                    userId: user.userInfoId
                },
                transaction: t
            });

        return {
            isUpdate: true,
            msg: ErrorMsg.ChangePicOK
        };
    });

    res.render("user/editresult", {
        "username": req.userinfo.username,
        "picture": req.file.filename,
        "Msg": userpicUpdate.msg
    });
}))

UserRouter.get("/edit/picture/delete", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("user/pictureDelete", {
        "username": req.userinfo.username,
        "name": userInformation.name,
        "comment": userInformation.comment,
        "picture": userInformation.picture,
        "email": userInformation.email
    })
}));

UserRouter.post("/edit/picture/delete", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    const {deleteOk} = req.body;

    if(deleteOk != "apply") {
        return res.render("user/edit", {
            "username": req.userinfo.username,
            "name": userInformation.name,
            "comment": userInformation.comment,
            "picture": userInformation.picture,
            "email": userInformation.email,
            Msg: ErrorMsg.NotInputValue
        });
    }

    const pictureDelete = await SequelizeUtil.db.transaction<{
        isUpdate: boolean,
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
                isUpdate: false,
                msg: "회원 정보가 없습니다. 다시 시도해주세요."
            };
        }

        await UserInfo.update({
                picture: ""
            },
            {
                where: {
                    userId: user.userInfoId
                },
                transaction: t
            });

        if(userInformation.picture !== "") {
            fs.unlinkSync('public/image/userpic/' + userInformation.picture);
        }

        return {
            isUpdate: true,
            msg: ErrorMsg.EditUpdateOK
        };
    });

    return res.render("user/editresult", {
        "username": req.userinfo.username,
        "picture": "nopic.jpg",
        "Msg": pictureDelete.msg
    });
}));

UserRouter.get("/edit/password", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    res.render("user/passwordChange", {
        "username": req.userinfo.username,
        "name": userInformation.name,
        "comment": userInformation.comment,
        "picture": userInformation.picture,
        "email": userInformation.email
    })
}));

UserRouter.post("/edit/password", Auth, WrapHandler(async (req, res) => {
    if(!req.userinfo) {
        return res.redirect("/");
    }

    const userInformation = await FindUserInfo(req.userinfo.username);

    const {prev_password, next_password1, next_password2} = req.body;

    if(!prev_password || !next_password1 || !next_password2) {
        return res.render("user/passwordChange", {
            "username": req.userinfo.username,
            "name": userInformation.name,
            "comment": userInformation.comment,
            "picture": userInformation.picture,
            "email": userInformation.email,
            Msg: ErrorMsg.NotInputValue
        });
    }

    const changePassword = await SequelizeUtil.db.transaction<{
        isUpdate: boolean,
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
                isUpdate: false,
                msg: "회원 정보가 없습니다. 다시 시도해주세요."
            };
        }

        const userInfo = await UserInfo.findOne<UserInfo>({
            where: {
                userId: user.userInfoId
            },
            transaction: t
        });

        if (userInfo && userInfo.pw !== prev_password) {
            return {
                isUpdate: false,
                msg: ErrorMsg.PasswordNotCorrect
            }
        }

        if (next_password1 !== next_password2) {
            return {
                isUpdate: false,
                msg: ErrorMsg.PasswordNotSame
            }
        }

        await UserInfo.update({
                pw: next_password1
            },
            {
                where: {
                    userId: user.userInfoId
                },
                transaction: t
            });

        return {
            isUpdate: true,
            msg: ErrorMsg.EditUpdateOK
        };
    });

    if (changePassword.isUpdate) {
        return res.render("user/editresult", {
            "username": req.userinfo.username,
            "picture": userInformation.picture,
            "Msg": changePassword.msg
        });
    } else {
        return res.render("user/passwordChange", {
            "username": req.userinfo.username,
            "name": userInformation.name,
            "picture": userInformation.picture,
            Msg: changePassword.msg
        });
    }
}));
