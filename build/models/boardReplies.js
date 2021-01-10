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
exports.BoardReplies = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = require("./users");
const board_1 = require("./board");
let BoardReplies = class BoardReplies extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.ForeignKey(() => board_1.Board),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "게시글 번호"
    }),
    __metadata("design:type", Number)
], BoardReplies.prototype, "boardNumber", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => board_1.Board),
    __metadata("design:type", board_1.Board)
], BoardReplies.prototype, "board", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => users_1.Users),
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "댓글을 단 유저 테이블의 인덱스"
    }),
    __metadata("design:type", Number)
], BoardReplies.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => users_1.Users),
    __metadata("design:type", users_1.Users)
], BoardReplies.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TEXT,
        comment: "댓글 내용"
    }),
    __metadata("design:type", String)
], BoardReplies.prototype, "contents", void 0);
BoardReplies = __decorate([
    sequelize_typescript_1.Table({
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        comment: "게시물 테이블"
    })
], BoardReplies);
exports.BoardReplies = BoardReplies;
//# sourceMappingURL=boardReplies.js.map