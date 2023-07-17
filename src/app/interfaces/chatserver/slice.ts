import { BaseModel } from "../entities/base-model";

export interface Slice {
    content: Array<BaseModel>,
    size: Number,
    number: Number,
    first: boolean,
    last: boolean
}
