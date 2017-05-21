import { MessageBoard } from './MessageBoard';
import { User } from './User';
import { JobProgress } from './JobProgress';
export class Job {
    key: string = '';
    jobCreatorName: string = '';
    jobCreatorUid: string = '';
    serviceList = [];
    description: string = '';
    room: string = '';
    building: string = '';
    placedOn: string = '';
    photosByClient = [];
    tradespersonList: User[] = []
    checkInPhotos = []
    completionPhotos = []
    private messageBoard = new MessageBoard()
    assignTradesperson(tp: User) {
        this.tradespersonList.push(tp)
    }

    public isTradespersonAssigned() {
        return this.tradespersonList.length > 0;
    }
    public getTradesPersonAssigned() {
        if (this.tradespersonList == undefined) {

        }
    }
    public isCheckedIn() {
        return this.checkInPhotos.length > 0;
    }
    public isCompleted() {
        return this.completionPhotos.length > 0;
    }
    public getMessageBoard() {
        if (this.messageBoard instanceof MessageBoard == false) {
            var mb = new MessageBoard()
            Object.assign(mb, this.messageBoard);
            this.messageBoard = mb;
        }

        return this.messageBoard;
    }
}
