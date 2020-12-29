import { ErrorMsg } from "../consts/errorMessage";

declare global {
    namespace Express {
        export interface Request {
            userinfo: {id: number, username: string, name: string}
        }
    }
}
