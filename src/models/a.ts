/*
import {Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne} from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'app_user',
    comment: "유저 테이블",
    underscored: true
})
export class User extends Model<User> {
    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        comment: '이메일'
    })
    email: string;

    @ForeignKey(() => UserInfo)
    @Column
    userInfoId: number;

    @BelongsTo(() => UserInfo)
    userInfo: UserInfo;
}

@Table({
    timestamps: true,
    tableName: 'app_user_info',
    comment: "유저 테이블",
    underscored: true
})
export class UserInfo extends Model<UserInfo> {
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        comment: '이름'
    })
    nm: string;

    @HasOne(() => User)
    user: User;
}




const sampleCode = async () => {
    // 데이터 생성
    const userInfo = await UserInfo.create({
        nm: 'ciao',
        user: {
            email: 'ciaolee87@gmail.com'
        }
    }, {
        // 같이 생성할 테이블 객체
        include: [User]
    });


    // 입력값 검색
    const user = await User.findOne({
        where: {
            email: 'ciaolee87@gmail.com'
        },
        include: [UserInfo]
    })
}
 */
