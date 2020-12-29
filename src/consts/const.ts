import {DotEnv} from "../utils/dotenv/dotenv";

DotEnv.loadEnv();

export const CookieID = "LoginSessionId";
export const SecretKey = process.env.JWT_SECRET || "";
export const GetExpiredTime = (): Date => {
    const expired = new Date().getTime() + 5 * 60 * 1000;
    return new Date(expired);
}
