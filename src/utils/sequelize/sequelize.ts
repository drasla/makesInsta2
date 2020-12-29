import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Users } from "../../models/users";
import { UserInfo } from "../../models/userInfo";

export class SequelizeUtil {
    static db: Sequelize;
    static async connect() {
        let config: SequelizeOptions = {
            username: process.env.MYSQL_ID,
            password: process.env.MYSQL_PW,
            database: process.env.MYSQL_DATABASE,
            host: process.env.MYSQL_HOST,
            port: 3440,
            dialect: 'mysql',
            dialectOptions: { decimalNumbers: true },
            timezone: '+09:00',
            logging: (str: string) => {
                console.log((str));
            }
        }

        let db = new Sequelize(config);

        db.addModels([Users, UserInfo]);
        await db.sync({
            alter: true,
            force: false,
            logging: true
        });

        this.db = db;
    }
}
