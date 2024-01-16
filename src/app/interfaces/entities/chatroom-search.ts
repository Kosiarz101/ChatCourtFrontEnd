import { BaseModel } from "./base-model";
import { Category } from "./category";

export interface ChatroomSearch extends BaseModel {
    name: string,
    description: string,
    isPublic: boolean,
    category: Category,
    userCount: number
}
