import { Column, DataType, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import { Board } from "./board";
import {BoardReplies} from "./boardReplies";
import {UserInfo} from "./userInfo";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "유저 테이블"
})
export class Users extends Model<Users> {
    @Column({
        type: DataType.STRING(100),
        comment: "유저 아이디"
    })
    username: string;

    @HasOne(() => UserInfo)
    userinfo: UserInfo;

    @HasMany(() => Board)
    board: Board[];

    @HasMany(() => BoardReplies)
    boardReplies: BoardReplies[];
}
