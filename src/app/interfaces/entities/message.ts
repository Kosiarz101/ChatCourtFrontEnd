import { AppUser } from "./app-user";
import { BaseModel } from "./base-model";
import { Chatroom } from "./chatroom";

export interface Message extends BaseModel {
    content: string,
    authorId: string,
    chatroomId: string
}
