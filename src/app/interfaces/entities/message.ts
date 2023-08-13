import { AppUser } from "./app-user";
import { Chatroom } from "./chatroom";

export interface Message {
    content: string,
    authorId: string,
    chatroomId: string
}
