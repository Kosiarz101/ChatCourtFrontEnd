import { ChatroomUserRole } from "src/app/enums/chatroom-user-role";
import { Chatroom } from "./chatroom";
import { AppUser } from "./app-user";

export interface ChatroomUser {
    role: ChatroomUserRole,
    chatroom: Chatroom,
    user: AppUser
}
