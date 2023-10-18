export default interface ErrorInterface extends Error{
    message: string,
    code:number
}