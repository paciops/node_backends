import { inject, injectable } from "inversify";
import { SafeboxLogic } from "../domain/interfaces";
import AlreadyExistError from "../errors/AlreadyExist";
import NotFoundError from "../errors/NotFound";
import SafeboxCreateResponse from "../models/safebox-create-response";

@injectable()
export class SafeboxService<T>{
    private safeboxEntity: SafeboxLogic<T>
    
    constructor(@inject("SafeboxLogic") safeboxEntity: SafeboxLogic<T>) {
        this.safeboxEntity = safeboxEntity;
    }

    async create(name: string, password: string){
        const id = await this.safeboxEntity.create(name, password)
        if(!id)
            throw new AlreadyExistError("Safebox already exists");
        return new SafeboxCreateResponse(id)
    }

    async getItems(id:string) {
        const safebox = await this.safeboxEntity.getById(id)
        if(!safebox)
            throw new NotFoundError("Requested safebox does not exist")
        return safebox.getItems()
    }

    async addItems(id: string,items: T[]) {
        const safebox = await this.safeboxEntity.getById(id)
        if(!safebox)
            throw new NotFoundError("Requested safebox does not exist")
        safebox.addItems(...items)
    }

    reset(){
        this.safeboxEntity.reset()
    }

    async getByName(name:string) {
        return this.safeboxEntity.getByName(name)
    }
}