import request from 'supertest';

import createServerIstance from "../../src/app";
import ResponseFormatter from "../../src/helpers/Response";
import PingPongResponse from "../../src/models/ping-pong-response";
import { SafeboxArray } from '../../src/domain/implementation';
import { StringValidator } from '../../src/domain/implementation/items';


describe('GET /ping', () => {
    const serverInstance = createServerIstance(SafeboxArray<string>, StringValidator)

    it('should return 200 OK', () => {
        return request(serverInstance).get('/ping').expect(200)
    });

    it('should return `pong` in response', async () => {
        const expectedResponse =
            ResponseFormatter
            .create<PingPongResponse>(new PingPongResponse('pong'))
            .toJson()

        return request(serverInstance)
            .get('/ping')
            .expect(expectedResponse)
    });
});
