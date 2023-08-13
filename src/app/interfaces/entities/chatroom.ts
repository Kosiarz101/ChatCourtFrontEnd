import { BaseModel } from "./base-model";
import { Message } from "./message";

export interface Chatroom extends BaseModel {
    name: string,
    messages: Array<Message>
}
