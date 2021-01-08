import {Handler} from "express";
import jwt from "jsonwebtoken";
import {GetExpiredTime, CookieID, SecretKey} from "../consts/const";
import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {Users} from "../models/users";
import {UserInfo} from "../models/userInfo";

export const Auth: Handler = (req, res, next) => {
    const token = req.cookies[CookieID];
    if (!token){
        next();
        return;
    }

    const decode = jwt.verify(token, SecretKey) as { id: number, username: string, name: string; };

    const time:any = GetExpiredTime();

    if (decode) {
        res.cookie(CookieID, token, {
            expires: new Date(time)
        })
        req.userinfo = decode;
        next();
    }
};

export const CreateToken = (id: Number, username: String, name: String) => {
    const token = jwt.sign({
            userid: id,
            username: username,   // 토큰의 내용(payload)
            name: name
        },
        SecretKey
    )

    const time: Date = GetExpiredTime();

    return {
        token: token,
        time: time,
    };
}

export const FindUserInfo = async (username: string) => {
    const findUser = await SequelizeUtil.db.transaction<{
        isFind: boolean,
        userId?: number,
        username?: string,
        name?: string,
        password?: string,
        email?: string,
        comment?: string,
        picture?: string
    }>(async t => {
        if (!process.env.JWT_SECRET) {
            return {
                isFind: false
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
                isFind: false
            }
        }

        const userInfo = await UserInfo.findOne<UserInfo>({
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
        }
    })
    return findUser;
}
