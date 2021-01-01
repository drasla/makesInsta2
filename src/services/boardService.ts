import {SequelizeUtil} from "../utils/sequelize/sequelize";
import {UserInfo} from "../models/userInfo";
import {Board} from "../models/board";
import {ErrorMsg} from "../consts/errorMessage";

export const CountOfPosts = async (userId: number) => {
    const count = await SequelizeUtil.db.transaction<{
        isCount: boolean,
        count?: number,
        msg?: string
    }>(async t => {
        const userInfo = await UserInfo.findOne<UserInfo>({
            where: {
                userId: userId
            },
            transaction: t
        });

        if (!userInfo) {
            return {
                isCount: false
            };
        }

        return {
            isCount: true,
            count: userInfo.posts
        }
    })
    return count;
}

export const FindPosts = async (userId: number) => {
    const posts = await SequelizeUtil.db.transaction<{
        isPost: boolean,
        data?: object,
        count?: number
        msg?: string
    }>(async t=> {
        const board = await Board.findAll<Board>({
            where: {
                userId: userId
            },
            transaction: t
        });


        const boardCount = await Board.count({
            where: {
                userId: userId
            },
            transaction: t
        })

        if(!board) {
            return {
                isPost: false,
                msg: ErrorMsg.NotFoundPosts,
            }
        }

        return {
            isPost: true,
            data: board,
            count: boardCount
        }
    })

    return posts;
}

export const PlusPostCount = async (userId: number) => {
    const plus = await SequelizeUtil.db.transaction<{
        isPlus: boolean
    }>(async t => {
        const prevCount = await CountOfPosts(userId);
        if (prevCount.count) {
            await UserInfo.update({
                    posts: prevCount.count + 1
                },
                {
                    where: {
                        userId: userId
                    },
                    transaction: t
                });

            return {
                isPlus: true
            }
        } else {
            return {
                isPlus: false
            }
        }
    })
    return plus;
}
