export class Message {
    text: string
    sender: string
    time: string
    imageUrl: string = ''
    constructor(text: string, sender: string) {
        this.sender = sender;
        this.text = text;
    }
}