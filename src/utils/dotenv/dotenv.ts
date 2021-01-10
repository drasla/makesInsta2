import * as path from "path";
import fs from "fs";
import dotEnv from "dotenv";

export class DotEnv {
    private static DEFAULT_PATH = '../../../env'

    static loadEnv(): void {
        const {NODE_ENV} = process.env;
        const envName = '.' + (NODE_ENV || 'env');
        const envPath = path.join(__dirname, this.DEFAULT_PATH, envName);
        this.load(envPath);
    }

    static loadEnvWithPath(rootPath: string): void {
        const {NODE_ENV} = process.env;
        const envName = '.' + (NODE_ENV || 'env');
        const envPath = path.join(rootPath, envName);
        this.load(envPath);
    }

    private static load(filePath: string): void {
        if (!fs.existsSync(filePath)) {
            console.log(`not found env file. ${filePath}`);
        //    process.exit(0);
        }

        const env = dotEnv.config({
            path: filePath,
            debug: true,
        });

        console.log('dot env loaded. ' + filePath);
        console.log(env.parsed);
    }
}
