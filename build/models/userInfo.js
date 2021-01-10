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
exports.UserInfo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = require("./users");
let UserInfo = class UserInfo extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "유저 이름"
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "nm", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "유저 비밀번호"
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "pw", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "유저 이메일"
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => users_1.Users),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserInfo.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => users_1.Users),
    __metadata("design:type", users_1.Users)
], UserInfo.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.TEXT,
        comment: "유저 남김말"
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "comment", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.STRING(100),
        comment: "유저 프로필 사진"
    }),
    __metadata("design:type", String)
], UserInfo.prototype, "picture", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: sequelize_typescript_1.DataType.INTEGER,
        comment: "게시글 갯수"
    }),
    __metadata("design:type", Number)
], UserInfo.prototype, "posts", void 0);
UserInfo = __decorate([
    sequelize_typescript_1.Table({
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: true,
        comment: "유저인포 테이블"
    })
], UserInfo);
exports.UserInfo = UserInfo;
//# sourceMappingURL=userInfo.js.map