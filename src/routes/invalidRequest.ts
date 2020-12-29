import {RequestHandler} from "express";

export const InvalidRequest: RequestHandler = ((req, res) => {
    res.send("not found router");
})
