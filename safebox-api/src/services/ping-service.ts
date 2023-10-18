import { injectable } from "inversify";
import PingPongResponse from "../models/ping-pong-response";

@injectable()
export class PingService {

    async getPing(): Promise<PingPongResponse> {
        return new PingPongResponse('pong');
    }
}
