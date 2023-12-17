import { BaseModel } from "../entities/base-model";

export interface ResponseEntity {
    headers: {"example": Array<string>},
    body: BaseModel,
    statusCode: string,
    statusCodeValue: Number
}
