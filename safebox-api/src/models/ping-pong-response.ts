export default class PingPongResponse {
    message: string;

    constructor(message: string) {
        this.message = message ? message : 'pong';
    }
}