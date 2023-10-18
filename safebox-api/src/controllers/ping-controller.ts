import { Request, Response } from 'express';
import { inject } from "inversify";
import { controller, httpGet, interfaces, request, response } from "inversify-express-utils";
import TYPES from '../constants/types-constants';
import { HttpStatus } from '../enums/http-status-enum';
import ResponseFormatter from '../helpers/Response';
import PingPongResponse from '../models/ping-pong-response';
import { PingService } from "../services/ping-service";

@controller("/ping")
export class PingController implements interfaces.Controller {

    constructor(@inject(TYPES.PingService) private readonly _pingService: PingService) { }

    @httpGet("/")
    async getPing(
        @request() req: Request,
        @response() res: Response
    ) {
        const response = await this._pingService.getPing();
        return res.status(HttpStatus.OK).send(ResponseFormatter.create<PingPongResponse>(response).toJson());
    }
}
