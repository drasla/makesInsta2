import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "유저인포 테이블"
})
export class UserInfo extends Model<UserInfo> {
    @Column({
        type: DataType.STRING(100),
        comment: "유저 이름"
    })
    nm: string;

    @Column({
        type: DataType.STRING(100),
        comment: "유저 비밀번호"
    })
    pw: string;

    @Column({
        type: DataType.STRING(100),
        comment: "유저 이메일"
    })
    email: string;

    @Column
    userId: number;

    @Column({
        type:DataType.TEXT,
        comment: "유저 남김말"
    })
    comment: string;

    @Column({
        type:DataType.STRING(100),
        comment: "유저 프로필 사진"
    })
    picture: string;
}
