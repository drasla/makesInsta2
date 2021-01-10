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
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const requestHandler_1 = require("../utils/requestHandler/requestHandler");
const users_1 = require("../models/users");
const errorMessage_1 = require("../consts/errorMessage");
const userInfo_1 = require("../models/userInfo");
const sequelize_1 = require("../utils/sequelize/sequelize");
const const_1 = require("../consts/const");
const fs_1 = __importDefault(require("fs"));
const fileUpload_1 = require("../services/fileUpload");
exports.UserRouter = express_1.default.Router();
exports.UserRouter.get("/", userService_1.Auth, (req, res) => {
    if (req.userinfo) {
        res.redirect("/user/edit");
    }
    else {
        res.redirect("/user/login");
    }
});
exports.UserRouter.get("/login", userService_1.Auth, (req, res) => {
    if (req.userinfo) {
        res.redirect(`${req.userinfo.username}/`);
    }
    else {
        res.render("index", { layout: false });
    }
});
exports.UserRouter.post("/login", requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.render("index", { "Msg": errorMessage_1.ErrorMsg.NotInputValue, layout: false });
    }
    const login = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        if (!process.env.JWT_SECRET) {
            return {
                isLogin: false,
                msg: "토큰이 잘못되었습니다. 관리자에게 문의하세요."
            };
        }
        const user = yield users_1.Users.findOne({
            where: {
                username: username
            },
            include: [
                {
                    model: userInfo_1.UserInfo,
                    where: {
                        pw: password
                    },
                }
            ],
            transaction: t
        });
        if (!user) {
            return {
                isLogin: false,
                msg: errorMessage_1.ErrorMsg.NotFoundUser
            };
        }
        const token = userService_1.CreateToken(user.id, user.username, user.userinfo.nm);
        res.cookie(const_1.CookieID, token.token, {
            expires: token.time
        });
        return {
            isLogin: true,
            username: user.username,
            token: token.token
        };
    }));
    if (login.isLogin) {
        res.redirect(`/${login.username}/`);
    }
    else {
        res.render("index", { "Msg": login.msg, layout: false });
    }
})));
exports.UserRouter.get("/join", userService_1.Auth, (req, res) => {
    if (req.userinfo) {
        res.redirect(`${req.userinfo.username}/`);
    }
    else {
        res.render("user/join", { layout: false });
    }
});
exports.UserRouter.post("/join", requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email || !name) {
        return res.render("user/join", { Msg: errorMessage_1.ErrorMsg.NotInputValue, layout: false });
    }
    const join = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        if (!process.env.JWT_SECRET) {
            return {
                isJoin: false,
                msg: errorMessage_1.ErrorMsg.NotFoundToken
            };
        }
        const findUser = yield users_1.Users.findOne({
            where: {
                username: username
            }
        });
        if (findUser) {
            return {
                isJoin: false,
                msg: errorMessage_1.ErrorMsg.FoundUser
            };
        }
        const findUserInfo = yield userInfo_1.UserInfo.findOne({
            where: {
                email: email
            }
        });
        if (findUserInfo) {
            return {
                isJoin: false,
                msg: errorMessage_1.ErrorMsg.FoundEmail
            };
        }
        const user = yield users_1.Users.create({
            username: username
        }, {
            transaction: t
        });
        const userInfo = yield userInfo_1.UserInfo.create({
            userId: user.id,
            nm: name,
            pw: password,
            email: email
        }, {
            transaction: t
        });
        yield user.save({
            transaction: t
        });
        const token = userService_1.CreateToken(user.id, username, userInfo.nm);
        res.cookie(const_1.CookieID, token.token, {
            expires: token.time
        });
        return {
            isJoin: true,
            username: user.username,
            token: token.token
        };
    }));
    if (join.isJoin) {
        res.render("user/success", { layout: false });
    }
    else {
        res.render("user/join", { Msg: join.msg, layout: false });
    }
})));
exports.UserRouter.get("/logout", (req, res) => {
    res.clearCookie(const_1.CookieID);
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
});
exports.UserRouter.get("/edit", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    res.render("user/edit", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    });
})));
exports.UserRouter.post("/edit", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const { name, comment, email } = req.body;
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    if (!name || !comment || !email) {
        return res.render("user/edit", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            Msg: errorMessage_1.ErrorMsg.NotInputValue
        });
    }
    const update = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
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
        const findEmail = yield userInfo_1.UserInfo.findAll({
            where: {
                email: email
            },
            transaction: t
        });
        if (1 < findEmail.length) {
            return {
                isUpdate: false,
                msg: errorMessage_1.ErrorMsg.FoundEmail
            };
        }
        yield userInfo_1.UserInfo.update({
            nm: name,
            email: email,
            comment: comment
        }, {
            where: {
                userId: user.id
            },
            transaction: t
        });
        return {
            isUpdate: true,
            msg: errorMessage_1.ErrorMsg.EditUpdateOK
        };
    }));
    res.render("user/result", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
        "Msg": update.msg
    });
})));
exports.UserRouter.get("/edit/picture/change", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    res.render("user/pictureChange", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    });
})));
exports.UserRouter.post("/edit/picture/change", userService_1.Auth, fileUpload_1.UserpicUpload.single("changePic"), requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    if (!req.file) {
        return res.render("user/edit", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture,
                Msg: errorMessage_1.ErrorMsg.NotInputValue
            }
        });
    }
    const userpicUpdate = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
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
            fs_1.default.unlinkSync('public/image/userpic/' + userInformation.picture);
        }
        yield userInfo_1.UserInfo.update({
            picture: req.file.filename
        }, {
            where: {
                userId: user.id
            },
            transaction: t
        });
        return {
            isUpdate: true,
            msg: errorMessage_1.ErrorMsg.ChangePicOK
        };
    }));
    res.render("user/editresult", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: req.file.filename
        },
        "Msg": userpicUpdate.msg
    });
})));
exports.UserRouter.get("/edit/picture/delete", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    res.render("user/pictureDelete", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    });
})));
exports.UserRouter.post("/edit/picture/delete", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const { deleteOk } = req.body;
    if (deleteOk != "apply") {
        return res.render("user/edit", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            Msg: errorMessage_1.ErrorMsg.NotInputValue
        });
    }
    const pictureDelete = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
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
        yield userInfo_1.UserInfo.update({
            picture: ""
        }, {
            where: {
                userId: user.id
            },
            transaction: t
        });
        if (userInformation.picture !== "") {
            fs_1.default.unlinkSync('public/image/userpic/' + userInformation.picture);
        }
        return {
            isUpdate: true,
            msg: errorMessage_1.ErrorMsg.EditUpdateOK
        };
    }));
    return res.render("user/editresult", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: "nopic.jpg"
        },
        "Msg": pictureDelete.msg
    });
})));
exports.UserRouter.get("/edit/password", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    res.render("user/passwordChange", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    });
})));
exports.UserRouter.post("/edit/password", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    const { prev_password, next_password1, next_password2 } = req.body;
    if (!prev_password || !next_password1 || !next_password2) {
        return res.render("user/passwordChange", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            Msg: errorMessage_1.ErrorMsg.NotInputValue
        });
    }
    const changePassword = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_1.Users.findOne({
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
        const userInfo = yield userInfo_1.UserInfo.findOne({
            where: {
                userId: user.id
            },
            transaction: t
        });
        if (userInfo && userInfo.pw !== prev_password) {
            return {
                isUpdate: false,
                msg: errorMessage_1.ErrorMsg.PasswordNotCorrect
            };
        }
        if (next_password1 !== next_password2) {
            return {
                isUpdate: false,
                msg: errorMessage_1.ErrorMsg.PasswordNotSame
            };
        }
        yield userInfo_1.UserInfo.update({
            pw: next_password1
        }, {
            where: {
                userId: user.id
            },
            transaction: t
        });
        return {
            isUpdate: true,
            msg: errorMessage_1.ErrorMsg.EditUpdateOK
        };
    }));
    if (changePassword.isUpdate) {
        return res.render("user/editresult", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            "Msg": changePassword.msg
        });
    }
    else {
        return res.render("user/passwordChange", {
            myinfo: {
                username: req.userinfo.username,
                name: userInformation.name,
                comment: userInformation.comment,
                email: userInformation.email,
                picture: userInformation.picture
            },
            Msg: changePassword.msg
        });
    }
})));
//# sourceMappingURL=userRouter.js.map