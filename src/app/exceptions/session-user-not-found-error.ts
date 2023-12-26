export class SessionUserNotFoundError extends Error {
    constructor(m: string) {
        super(m)
    }
}
