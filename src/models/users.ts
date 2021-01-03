import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "유저 테이블"
})
export class Users extends Model<Users> {
    @Column({
        type: DataType.INTEGER,
        comment: "유저 테이블 아이디"
    })
    id: number;

    @Column({
        type: DataType.STRING(100),
        comment: "유저 아이디"
    })
    username: string;

    @Column({
        type: DataType.INTEGER,
        comment: "유저인포 테이블의 아이디"
    })
    userInfoId: number;
}
