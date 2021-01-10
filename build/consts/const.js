"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetExpiredTime = exports.SecretKey = exports.CookieID = void 0;
const dotenv_1 = require("../utils/dotenv/dotenv");
dotenv_1.DotEnv.loadEnv();
exports.CookieID = "LoginSessionId";
exports.SecretKey = process.env.JWT_SECRET || "";
exports.GetExpiredTime = () => {
    const expired = new Date().getTime() + 5 * 60 * 1000;
    return new Date(expired);
};
//# sourceMappingURL=const.js.map