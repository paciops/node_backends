import { Container } from "inversify";
import TYPES from "../../../src/constants/types-constants";
import createServerIstance from "../../../src/app";
import { SafeboxMap } from "../../../src/domain/implementation";
import { HttpStatus } from "../../../src/enums/http-status-enum";
import { StringValidator } from "../../../src/domain/implementation/items";
import { SafeboxService } from "../../../src/services";
import { createSafebox, getSafeboxItemsRequest, addItem, createSafeboxRequest, putSafeboxItemsRequest } from "../utils";

describe('SafeboxMapString', () => {
    const name = "safebox", 
        password = "passworD1!",
        container = new Container(),
        serverInstance = createServerIstance(SafeboxMap<string>, StringValidator, container);

    afterEach(() => {
        container.get<SafeboxService<string>>(TYPES.SafeboxService).reset()
    })

    it('should create a new safebox', async () => {
        await createSafebox(serverInstance, name, password)
    });

    it('should get created safebox\'s items equals to zero', async () => {
        const id = await createSafebox(serverInstance, name, password)
        
        const response = await getSafeboxItemsRequest(serverInstance, id, name, password)
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(0)
    });

    it('should get created safebox\'s items equals to one', async () => {
        const id = await createSafebox(serverInstance, name, password)
        await addItem(serverInstance, id, name, password, ["first secret"])
        
        const response = await getSafeboxItemsRequest(serverInstance, id, name, password)
        
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(1)
    });
    
    it('should return an error if two safebox are created with the same name', async () => {
        
        await createSafebox(serverInstance, name, password)
        
        const response = await createSafeboxRequest(serverInstance, name, password)
        
        expect(response.statusCode).toBe(HttpStatus.CONFLICT)
        expect(response.text).toBe("Safebox already exists")
    });

    it('should return an error if password is weak', async () => {
        const name = "safebox", 
            password = "password";
        
        const response = await createSafeboxRequest(serverInstance, name, password)
        
        expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0]).toBeDefined()
        expect(response.body.errors[0].msg).toBe("Invalid value")
        expect(response.body.errors[0].location).toBe("body")
    });

    it('should return an error if safebox is not found when getting items', async () => {
        const id = "nonExistingSafebox"

        const response = await getSafeboxItemsRequest(serverInstance, id, name, password)

        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
        expect(response.text).toBe("Requested safebox does not exist")
    });

    it('should return an error if safebox is not found when adding items', async () => {
        const id = "nonExistingSafebox"
        
        const response = await putSafeboxItemsRequest(serverInstance, id, name, password, [])
        
        expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
        expect(response.text).toBe("Requested safebox does not exist")
    });

    it('should return an error if safebox\'s password is wrong', async () => {
        const id = await createSafebox(serverInstance, name, password)
        
        const response = await getSafeboxItemsRequest(serverInstance, id, name, "wrong")
        
        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED)
        expect(response.text).toBe("Specified Basic Auth does not match")
    });

});