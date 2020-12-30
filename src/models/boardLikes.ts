import {Column, DataType, Model, Table} from "sequelize-typescript";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "게시물 테이블"
})
export class BoardLikes extends Model<BoardLikes> {
    @Column({
        type: DataType.INTEGER,
        comment: "게시글 번호"
    })
    boardNumber: number;

    @Column({
        type: DataType.INTEGER,
        comment: "좋아요 한 유저 테이블의 인덱스"
    })
    userId: number;
}
