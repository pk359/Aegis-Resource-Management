export class Message {
    text: string
    sender: string
    private time: string = ''
    imageUrl: string = ''
    constructor() {
    }
    public setTime(time: Date) {
        this.time = time.toJSON()
    }
    public getTime() {
        return new Date(this.time)
    }
}