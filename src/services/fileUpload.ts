import moment from "moment";
import multer from "multer";
import {Request, Response, NextFunction} from "express";
import fs from "fs";
import path from "path";

export const storage = (folder: string) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            if (folder === "userpic") {
                callback(null, "public/image/userpic");
            } else {
                callback(null, "public/image/boardpic");
            }
            // const date: string = moment().format("YYMMDD");
            // if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            //     callback(null, "public/image/userpic/" + date + "/");
            // } else if (file.originalname.match(/\.(txt|csv)$/)) {
            //     callback(null,"public/" + date + "/");
            // }
        },
        filename: ((req, file, callback) => {
            const date: string = moment().format("YYMMDDHHmmss");
            if(folder === "userpic") {
                const username: string = req.userinfo.username;
                const ext: string = path.extname(file.originalname);
                const fname: string = username + "_" + date + ext;
                callback(null, fname);
            } else {
                const username: string = req.userinfo.username;
                const ext: string = path.extname(file.originalname);
                const fname: string = username + "_" + date + ext;
                callback(null, fname);
            }
        })
    });
}

export const UserpicUpload = multer({
    storage: storage("userpic"),
    limits: {
        files: 10
    }
})

export const BoardPicUpload = multer({
    storage: storage("boardpic"),
    limits: {
        files: 10
    }
})

export const fileHandler = (req: Request, res: Response, next: NextFunction) => {
    const date: string = moment().format("YYMMDD");
    const fileDir: string = "/public/" + date;
    const imageDir: string = "/public/image/" + date;
    try {
        const stat = fs.lstatSync(fileDir);
    } catch {
        fs.mkdirSync(fileDir, {recursive: true});
        fs.mkdirSync(imageDir,{recursive:true});
    } finally {
        next();
    }
}
