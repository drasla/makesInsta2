import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Users} from "./users";
import {BoardReplies} from "./boardReplies";
import {BoardLikes} from "./boardLikes";

@Table ({
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    timestamps: true,
    comment: "게시물 테이블"
})
export class Board extends Model<Board> {
    @HasMany(() => BoardReplies)
    boardReplies: BoardReplies[];

    @HasMany(() => BoardLikes)
    boardLikes: BoardLikes[];

    @Column({
        type:DataType.TEXT,
        comment: "내용"
    })
    contents: string;

    @Column({
        type:DataType.STRING(100),
        comment: "파일명"
    })
    file: string;

    @Column({
        type: DataType.INTEGER,
        comment: "좋아요 수"
    })
    likes: number;

    @Column({
        type: DataType.INTEGER,
        comment: "댓글 수"
    })
    replies: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        comment: "유저 테이블의 인덱스"
    })
    userId: number;

    @BelongsTo(() => Users)
    user: Users;
}
