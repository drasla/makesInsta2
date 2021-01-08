import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Users } from "./users";
import {Board} from "./board";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "게시물 테이블"
})
export class BoardLikes extends Model<BoardLikes> {
    @ForeignKey(() => Board)
    @Column({
        type: DataType.INTEGER,
        comment: "게시글 번호"
    })
    boardNumber: number;

    @BelongsTo(() => Board)
    board: Board;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        comment: "좋아요 한 유저 테이블의 인덱스"
    })
    userId: number;

    @BelongsTo(() => Users)
    user: Users;
}
