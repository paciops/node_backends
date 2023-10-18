import request from 'supertest';

const DEFAULT_ITEMS: any[] = ["Safebox content 01", "New safebox content"]

export const createSafeboxRequest = (serverInstance:any, name: string, password:string) => request(serverInstance).post('/safebox').set('Accept', 'application/json').send({name, password})

export const getSafeboxItemsRequest = (serverInstance: any, id: string, name: string,password: string) => request(serverInstance).get(`/safebox/${id}/items`).auth(name,password,{type:'basic'}).accept('application/json')

export const putSafeboxItemsRequest = (serverInstance: any, id: string, name: string,password: string, items: any[]) => request(serverInstance).put(`/safebox/${id}/items`).auth(name,password,{type:'basic'}).accept('application/json').send({items})

export const createSafebox = async (
    serverInstance: any,
    name: string,
    password: string
    ) => {
    const response = await createSafeboxRequest(serverInstance, name, password)

    expect(response.statusCode).toBe(200)
    expect(typeof response.body).toBe("object")
    expect(response.body.id).toBeDefined()
    return response.body.id
}

export const addItem = async (
    serverInstance: any,
    id: string,
    name: string,
    password: string,
    items = DEFAULT_ITEMS
    ) => {
    const response = await putSafeboxItemsRequest(serverInstance, id, name, password, items)

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe("OK")
}