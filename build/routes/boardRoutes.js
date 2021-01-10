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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRouter = void 0;
const express_1 = __importDefault(require("express"));
const userService_1 = require("../services/userService");
const requestHandler_1 = require("../utils/requestHandler/requestHandler");
exports.BoardRouter = express_1.default.Router();
exports.BoardRouter.get("/", userService_1.Auth, requestHandler_1.WrapHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userinfo) {
        return res.redirect("/");
    }
    console.log(req.method);
    const userInformation = yield userService_1.FindUserInfo(req.userinfo.username);
    res.render("board/list", {
        myinfo: {
            username: req.userinfo.username,
            name: userInformation.name,
            comment: userInformation.comment,
            email: userInformation.email,
            picture: userInformation.picture
        },
    });
})));
//# sourceMappingURL=boardRoutes.js.map