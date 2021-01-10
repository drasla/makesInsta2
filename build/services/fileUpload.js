"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileHandler = exports.BoardPicUpload = exports.UserpicUpload = exports.storage = void 0;
const moment_1 = __importDefault(require("moment"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.storage = (folder) => {
    return multer_1.default.diskStorage({
        destination: (req, file, callback) => {
            if (folder === "userpic") {
                callback(null, "public/image/userpic");
            }
            else {
                callback(null, "public/image/boardpic");
            }
        },
        filename: ((req, file, callback) => {
            const date = moment_1.default().format("YYMMDDHHmmss");
            if (folder === "userpic") {
                const username = req.userinfo.username;
                const ext = path_1.default.extname(file.originalname);
                const fname = username + "_" + date + ext;
                callback(null, fname);
            }
            else {
                const username = req.userinfo.username;
                const ext = path_1.default.extname(file.originalname);
                const fname = username + "_" + date + ext;
                callback(null, fname);
            }
        })
    });
};
exports.UserpicUpload = multer_1.default({
    storage: exports.storage("userpic"),
    limits: {
        files: 10
    }
});
exports.BoardPicUpload = multer_1.default({
    storage: exports.storage("boardpic"),
    limits: {
        files: 10
    }
});
exports.fileHandler = (req, res, next) => {
    const date = moment_1.default().format("YYMMDD");
    const fileDir = "/public/" + date;
    const imageDir = "/public/image/" + date;
    try {
        const stat = fs_1.default.lstatSync(fileDir);
    }
    catch (_a) {
        fs_1.default.mkdirSync(fileDir, { recursive: true });
        fs_1.default.mkdirSync(imageDir, { recursive: true });
    }
    finally {
        next();
    }
};
//# sourceMappingURL=fileUpload.js.map