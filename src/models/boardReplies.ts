import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Users} from "./users";
import {Board} from "./board";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "게시물 테이블"
})
export class BoardReplies extends Model<BoardReplies> {
/*    @BelongsTo(() => Board)
    @ForeignKey(() => Board)*/
    @Column({
        type: DataType.INTEGER,
        comment: "게시글 번호"
    })
    boardNumber: number;

/*    @BelongsTo(() => Users)
    @ForeignKey(() => Users)*/
    @Column({
        type: DataType.INTEGER,
        comment: "댓글을 단 유저 테이블의 인덱스"
    })
    userId: number;

    @Column({
        type: DataType.TEXT,
        comment: "댓글 내용"
    })
    contents: string;
}
