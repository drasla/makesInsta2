import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import { Board } from "./board";
import { BoardLikes } from "./boardLikes";
import {UserInfo} from "./userInfo";
import {BoardReplies} from "./boardReplies";

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

    @ForeignKey(() => UserInfo)
    @Column({
        type: DataType.INTEGER,
        comment: "유저인포 테이블의 아이디"
    })
    userInfoId: number;

    @HasMany(() => UserInfo)
    @HasMany(() => Board)
    @Column({
        type: DataType.INTEGER,
        comment: "유저 인덱스 아이디",
        primaryKey: true,
        autoIncrement: true
    })
    id: number;
}
