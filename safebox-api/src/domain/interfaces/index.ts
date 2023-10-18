type IdType = string
type NameType = string
type PasswordType = string

type Value<T> = T | Promise<T>

export class Safebox<T>{
    id: IdType
    name: NameType
    password: PasswordType
    private items: Array<T>

    constructor(id: IdType, name:NameType, password:PasswordType){
        this.id = id
        this.name = name
        this.password = password
        this.items =[]
    }

    addItems(...items:T[]){
        this.items.push(...items)
    }

    getItems(){
        return structuredClone(this.items)
    }
}

export interface SafeboxLogic<T>{
    create(name: NameType, password: PasswordType): Value<IdType | undefined>,
    getById(id:IdType): Value<Safebox<T> | undefined>,
    getByName(name: NameType): Value<Safebox<T> | undefined>,
    reset():void
}