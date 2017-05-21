import { TimeHelper } from './../Utilities/time-helper';
import { Message } from './Message';
export class MessageBoard {
    private messages: Message[] = []
    getMessages(): Message[] {
        if (this.messages.length > 0) {
            if (this.messages[0] instanceof Message == false) {
                for (var i = 0; i < this.messages.length; i++) {
                    var m = this.messages[i]
                    var mm: Message = new Message(m.text, m.sender)
                    Object.assign(mm, m)
                    this.messages[i] = mm;
                }
            }
        }
        return this.messages;
    }
    addMessage(m: Message) {
        this.messages.push(m)
    }
}