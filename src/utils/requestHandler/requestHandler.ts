import {RequestHandler} from "express";

export const WrapHandler = (handler: RequestHandler): RequestHandler => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch(e) {
            res.send(e);
        }
    }
}
