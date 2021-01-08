/*
import {Table, Column, Model, DataType, ForeignKey, HasOne, BelongsTo, HasMany} from 'sequelize-typescript';
import {Op} from "sequelize";

@Table({
    timestamps: true,
    tableName: 'app_user',
    comment: "user",
    underscored: true
})
export class User extends Model<User> {
    @Column
    email: string;

    @ForeignKey(() => UserInfo)
    @Column
    userInfoId: number;

    @BelongsTo(() => UserInfo)
    userInfo: UserInfo;

    @HasMany(() => Board)
    board: Board[]
}


@Table({
    timestamps: true,
    tableName: 'app_user_info',
    comment: "user_info",
    underscored: true
})
export class UserInfo extends Model<UserInfo> {
    @Column
    nm: string;

    @HasOne(() => User)
    user: User;
}


@Table
export class Board extends Model<Board> {
    @Column
    contents: string

    @HasMany(() => Reply, 'boardId')
    reply: Reply[];

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}


const a = async () => {
    const boardList = await Board.findAll({
        where: {
            createdAt: {
                [Op.lt]: new Date()
            }
        },
        include: [User, Reply],
    });


    Board.create({
        contents: 'aaaa',
        user: await User.findOne({
            where: {
                id: 1
            }
        }),
        reply: [
            {reply: 'abcd'}
        ]
    }, {
        include: [User]
    })

}

@Table
export class Reply extends Model<Reply> {
    @Column
    reply: string;

    @ForeignKey(() => Board)
    @Column
    boardId: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => Board)
    board: Board;

    @BelongsTo(() => User)
    user: User;
}
*/
