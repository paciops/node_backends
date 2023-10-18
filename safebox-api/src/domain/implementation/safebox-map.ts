import { randomUUID } from "crypto";
import { injectable } from "inversify";
import { Safebox, SafeboxLogic } from "../interfaces";

@injectable()
export class SafeboxMap<T> implements SafeboxLogic<T>{
    safeboxesByID: Map<Safebox<T>['id'], Safebox<T>>
    safeboxesByName: Map<Safebox<T>['name'], Safebox<T>>

    constructor(){
        this.safeboxesByID = new Map()
        this.safeboxesByName = new Map()
    }

    create(name: string, password: string) {
        const existingSafebox = this._findByName(name)
        if(existingSafebox)
            return undefined
        
        const id = randomUUID()
        const safebox = new Safebox<T>(id,name,password)
        this.safeboxesByID.set(safebox.id, safebox)
        this.safeboxesByName.set(safebox.name, safebox)
        return safebox.id
    }

    getById(id: string) {
        return this._findById(id)
    }

    getByName(name: string) {
        return this._findByName(name)
    }

    reset() {
        this.safeboxesByID.clear()
        this.safeboxesByName.clear()
    }

    private _findByName(name: string) {
        return this.safeboxesByName.get(name)
    }

    private _findById(id: string) {
        return this.safeboxesByID.get(id)
    }
}