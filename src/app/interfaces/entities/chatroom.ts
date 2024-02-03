import { BaseModel } from "./base-model";
import { Category } from "./category";

export interface Chatroom extends BaseModel {
    name: string,
    isPublic: boolean,
    category: Category
}
