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
exports.FindUserInfo = exports.CreateToken = exports.Auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const const_1 = require("../consts/const");
const sequelize_1 = require("../utils/sequelize/sequelize");
const users_1 = require("../models/users");
const userInfo_1 = require("../models/userInfo");
exports.Auth = (req, res, next) => {
    const token = req.cookies[const_1.CookieID];
    if (!token) {
        next();
        return;
    }
    const decode = jsonwebtoken_1.default.verify(token, const_1.SecretKey);
    const time = const_1.GetExpiredTime();
    if (decode) {
        res.cookie(const_1.CookieID, token, {
            expires: new Date(time)
        });
        req.userinfo = decode;
        next();
    }
};
exports.CreateToken = (id, username, name) => {
    const token = jsonwebtoken_1.default.sign({
        userid: id,
        username: username,
        name: name
    }, const_1.SecretKey);
    const time = const_1.GetExpiredTime();
    return {
        token: token,
        time: time,
    };
};
exports.FindUserInfo = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield sequelize_1.SequelizeUtil.db.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        if (!process.env.JWT_SECRET) {
            return {
                isFind: false
            };
        }
        const user = yield users_1.Users.findOne({
            where: {
                username: username
            },
            transaction: t
        });
        if (!user) {
            return {
                isFind: false
            };
        }
        const userInfo = yield userInfo_1.UserInfo.findOne({
            where: {
                userId: user.id
            },
            transaction: t
        });
        if (!userInfo) {
            return {
                isFind: false
            };
        }
        return {
            isFind: true,
            username: user.username,
            userId: user.id,
            name: userInfo.nm,
            password: userInfo.pw,
            email: userInfo.email,
            comment: userInfo.comment,
            picture: userInfo.picture
        };
    }));
    return findUser;
});
//# sourceMappingURL=userService.js.map