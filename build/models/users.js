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
exports.Users = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const board_1 = require("./board");
const boardReplies_1 = require("./boardReplies");
const userInfo_1 = require("./userInfo");
const boardLikes_1 = require("./boardLikes");
let Users = class Users extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "유저 아이디"
    }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => userInfo_1.UserInfo),
    __metadata("design:type", userInfo_1.UserInfo)
], Users.prototype, "userinfo", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => board_1.Board),
    __metadata("design:type", Array)
], Users.prototype, "board", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => boardReplies_1.BoardReplies),
    __metadata("design:type", Array)
], Users.prototype, "boardReplies", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => boardLikes_1.BoardLikes),
    __metadata("design:type", Array)
], Users.prototype, "boardLikes", void 0);
Users = __decorate([
    sequelize_typescript_1.Table({
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        comment: "유저 테이블"
    })
], Users);
exports.Users = Users;
//# sourceMappingURL=users.js.map