"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotEnv = void 0;
const path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
class DotEnv {
    static loadEnv() {
        const { NODE_ENV } = process.env;
        const envName = '.' + (NODE_ENV || 'env');
        const envPath = path.join(__dirname, this.DEFAULT_PATH, envName);
        this.load(envPath);
    }
    static loadEnvWithPath(rootPath) {
        const { NODE_ENV } = process.env;
        const envName = '.' + (NODE_ENV || 'env');
        const envPath = path.join(rootPath, envName);
        this.load(envPath);
    }
    static load(filePath) {
        if (!fs_1.default.existsSync(filePath)) {
            console.log(`not found env file. ${filePath}`);
        }
        const env = dotenv_1.default.config({
            path: filePath,
            debug: true,
        });
        console.log('dot env loaded. ' + filePath);
        console.log(env.parsed);
    }
}
exports.DotEnv = DotEnv;
DotEnv.DEFAULT_PATH = '../../../env';
//# sourceMappingURL=dotenv.js.map