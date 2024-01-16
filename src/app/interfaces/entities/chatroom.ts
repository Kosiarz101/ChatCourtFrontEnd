import { BaseModel } from "./base-model";
import { Category } from "./category";
import { ChatroomUser } from "./chatroom-user";
import { Message } from "./message";

export interface Chatroom extends BaseModel {
    name: string,
    isPublic: boolean,
    category: Category
    messages?: Array<Message>
    users?: Array<ChatroomUser>
}
