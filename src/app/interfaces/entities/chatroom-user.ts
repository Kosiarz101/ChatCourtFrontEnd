import { ChatroomUserRole } from "src/app/enums/chatroom-user-role";
import { Chatroom } from "./chatroom";
import { AppUser } from "./app-user";
import { BaseModel } from "./base-model";

export interface ChatroomUser extends BaseModel {
    role: ChatroomUserRole,
    chatroom: Chatroom,
    user: AppUser
}
