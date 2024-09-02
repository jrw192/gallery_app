export interface SessionData {
    sid: string,
    name: string,
}

export interface Postcard {
    id: string,
    creator: string,
    location: string,
    date: Date,
    message: string,
}