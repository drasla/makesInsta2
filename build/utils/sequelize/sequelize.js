"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeUtil = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = require("../../models/users");
const userInfo_1 = require("../../models/userInfo");
const board_1 = require("../../models/board");
const boardLikes_1 = require("../../models/boardLikes");
const boardReplies_1 = require("../../models/boardReplies");
class SequelizeUtil {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            let config = {
                username: process.env.MYSQL_ID,
                password: process.env.MYSQL_PW,
                database: process.env.MYSQL_DATABASE,
                host: process.env.MYSQL_HOST,
                port: 3440,
                dialect: 'mysql',
                dialectOptions: { decimalNumbers: true },
                timezone: '+09:00',
                logging: (str) => {
                    console.log((str));
                }
            };
            let db = new sequelize_typescript_1.Sequelize(config);
            db.addModels([users_1.Users, userInfo_1.UserInfo, board_1.Board, boardLikes_1.BoardLikes, boardReplies_1.BoardReplies]);
            yield db.sync({
                alter: true,
                force: false,
                logging: true
            });
            this.db = db;
        });
    }
}
exports.SequelizeUtil = SequelizeUtil;
//# sourceMappingURL=sequelize.js.map