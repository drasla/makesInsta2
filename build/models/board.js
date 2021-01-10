"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = require("./users");
const boardReplies_1 = require("./boardReplies");
const boardLikes_1 = require("./boardLikes");
let Board = class Board extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.HasMany(() => boardReplies_1.BoardReplies),
    __metadata("design:type", Array)
], Board.prototype, "boardReplies", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => boardLikes_1.BoardLikes),
    __metadata("design:type", Array)
], Board.prototype, "boardLikes", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TEXT,
        comment: "내용"
    }),
    __metadata("design:type", String)
], Board.prototype, "contents", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "파일명"
    }),
    __metadata("design:type", String)
], Board.prototype, "file", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "좋아요 수"
    }),
    __metadata("design:type", Number)
], Board.prototype, "likes", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "댓글 수"
    }),
    __metadata("design:type", Number)
], Board.prototype, "replies", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => users_1.Users),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "유저 테이블의 인덱스"
    }),
    __metadata("design:type", Number)
], Board.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => users_1.Users),
    __metadata("design:type", users_1.Users)
], Board.prototype, "user", void 0);
Board = __decorate([
    sequelize_typescript_1.Table({
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        comment: "게시물 테이블"
    })
], Board);
exports.Board = Board;
//# sourceMappingURL=board.js.map