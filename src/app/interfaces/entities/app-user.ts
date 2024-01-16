import { BaseModel } from "./base-model"
import { Chatroom } from "./chatroom"

export interface AppUser extends BaseModel {

    email: string,
    password: string,
    username: string,
    messages?: Array<Object> 
    chatrooms?: Array<Chatroom>
}
