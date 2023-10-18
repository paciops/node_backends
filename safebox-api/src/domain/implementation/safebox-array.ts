import { randomUUID } from "crypto";
import { injectable } from "inversify";
import { Safebox, SafeboxLogic } from "../interfaces";

@injectable()
export class SafeboxArray<T> implements SafeboxLogic<T>{
    safeboxes: Safebox<T>[]

    constructor(){
        this.safeboxes = []
    }

    create(name: string, password: string) {
        const existingSafebox = this._findByName(name)
        if(existingSafebox)
            return undefined
        
        const id = randomUUID()
        const safebox = new Safebox<T>(id,name,password)
        this.safeboxes.push(safebox)
        return safebox.id
    }

    getById(id: string) {
        return this._findById(id)
    }

    getByName(name: string) {
        return this._findByName(name)
    }

    reset(): void {
        this.safeboxes = []
    }

    private _findByName(name: string) {
        return this.safeboxes.find(current=> current.name === name)
    }

    private _findById(id: string) {
        return this.safeboxes.find(current=> current.id === id)
    }
}