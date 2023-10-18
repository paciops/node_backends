export default class Response<T> {
    result: T;

    constructor(response: T) {
        this.result = response;
    }

    public static create<T>(response: T): Response<T> {
        return new Response<T>(response);
    }

    public toJson(): string {
        return JSON.stringify(this.result);
    }
}
