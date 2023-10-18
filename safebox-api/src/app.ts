import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { getEnvironment } from './configs/env-selector';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { PingService,  SafeboxService} from './services';
import TYPES from './constants/types-constants';
import { RequestValidator } from './helpers/request-validator';
import { AuthMiddleware } from './helpers/auth-middleware';
import { SafeboxLogic } from './domain/interfaces';

//Import controllers
import './controllers/';
import { TypeValidator, ItemsValidator } from './helpers/type-validator';

getEnvironment();

export default function  buildServerIstance<T>(
    SafeboxDataStructure: new () => SafeboxLogic<T>,
    Validator: { new (): TypeValidator }, 
    container = new Container()
) {
    //Bind services
    container.bind<PingService>(TYPES.PingService).to(PingService);
    container.bind<SafeboxLogic<T>>("SafeboxLogic").to(SafeboxDataStructure).inSingletonScope();
    container.bind<SafeboxService<T>>(TYPES.SafeboxService).to(SafeboxService<T>).inSingletonScope();

    // Bind middleware
    container.bind<RequestValidator>(RequestValidator).toSelf();
    container.bind<AuthMiddleware<T>>(AuthMiddleware).toSelf();
    container.bind<ItemsValidator>(ItemsValidator).toSelf()
    container.bind<TypeValidator>(TYPES.TypeValidator).to(Validator)

    const server = new InversifyExpressServer(container);

    server.setConfig((app) => {
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(cors())
        app.use(bodyParser.json());
    }).setErrorConfig(app => {
        app.use((err, req, res, next)=>{
            console.error(err.stack)
            res.status(500).send('Something broke!');
        });
    });
    return server.build();
}