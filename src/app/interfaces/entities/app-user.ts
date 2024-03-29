import { BaseModel } from "./base-model"

export interface AppUser extends BaseModel {

    email: string,
    password: string,
    username: string
}
