import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {Users} from "./users";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "유저인포 테이블"
})
export class UserInfo extends Model<UserInfo> {
/*    @HasOne(()=> Users, {foreignKey: "userInfoId", sourceKey: "id"})*/
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

/*    @BelongsTo(() => Users)
    @ForeignKey(() => Users)*/
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

    @Column({
        type:DataType.INTEGER,
        comment: "게시글 갯수"
    })
    posts: number;
}
