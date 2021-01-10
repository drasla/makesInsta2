"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("./utils/dotenv/dotenv");
const sequelize_1 = require("./utils/sequelize/sequelize");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const indexRoutes_1 = require("./routes/indexRoutes");
const userRouter_1 = require("./routes/userRouter");
const invalidRequest_1 = require("./routes/invalidRequest");
dotenv_1.DotEnv.loadEnv();
sequelize_1.SequelizeUtil.connect().then();
const app = express_1.default();
const SESSION = process.env.SESSION_SECRET;
if (!SESSION) {
    console.log("session key not found");
    process.exit(1);
}
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
app.use(express_ejs_layouts_1.default);
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({
    extended: false
}));
app.use(cookie_parser_1.default(process.env.COOKIE_PARSER || "speciallyValue"));
app.use(express_1.default.json());
app.use(express_session_1.default({
    resave: false,
    saveUninitialized: false,
    secret: SESSION,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use("/users", userRouter_1.UserRouter);
app.use("/", indexRoutes_1.IndexRouter);
app.use("/", invalidRequest_1.InvalidRequest);
app.listen(process.env.PORT, () => {
    console.log(`Server on : http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=main.js.map