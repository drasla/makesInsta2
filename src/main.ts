import { DotEnv } from "./utils/dotenv/dotenv";
import { SequelizeUtil } from "./utils/sequelize/sequelize";
import express from "express";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import session from "express-session";
import { IndexRouter } from "./routes/rootRoutes";
import { UserRouter } from "./routes/userRouter";
import { InvalidRequest } from "./routes/invalidRequest";
import {BoardRouter} from "./routes/boardRoutes";

DotEnv.loadEnv();
SequelizeUtil.connect().then();

const app = express();
const SESSION = process.env.SESSION_SECRET;
if(!SESSION) {
    console.log("session key not found");
    process.exit(1);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(expressEjsLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser(process.env.COOKIE_PARSER || "speciallyValue"));
app.use(express.json());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: SESSION,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use("/users", UserRouter);
app.use("/:id", BoardRouter);
app.use("/", IndexRouter);
app.use("/", InvalidRequest);

app.listen(process.env.PORT, () => {
    console.log(`Server on : http://localhost:${process.env.PORT}`);
});
