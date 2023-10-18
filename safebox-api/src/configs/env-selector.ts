import EnvironmentConstants from "../constants/environment-constants";
import * as dotenv from 'dotenv';
import { resolve } from 'path';

export let envData: any = {};

export const getEnvironment = () => {
    switch (process.env.SKELETON_ENV) {
        case EnvironmentConstants.PRODUCTION:
            envData = dotenv.config({ path: resolve(__dirname, '../../.env') }).parsed;
            break;
        case EnvironmentConstants.LOCAL:
            envData = dotenv.config({ path: resolve(__dirname, '../../.env.local') }).parsed;
            break
        case EnvironmentConstants.DEVELOP:
            envData = dotenv.config({ path: resolve(__dirname, '../../.env.dev') }).parsed;
            break;
        case EnvironmentConstants.TEST:
            envData = dotenv.config({ path: resolve(__dirname, '../../.env.test') }).parsed;
            break;
        default:
            envData = dotenv.config().parsed;
    }
}
