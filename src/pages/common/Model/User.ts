import { Job } from './Job';
import firebase from 'firebase'
export class User {
    name: string
    uid: string
    email: string
    role: string
    token: string
    public hasAccessToJob(job: Job) {
        if (this.role == 'superUser' || this.role == 'manager') {
            return true;
        } else if (this.role == 'tradesperson') {
            var found = false;
            job.getTradesPersonAssigned().forEach(user => {
                if (user.name == this.name) {
                    found = true;
                }
            })
            return found;
        } else if (this.role == 'client') {
            console.log(job.jobCreatorName + "  " + this.name)
            if (job.jobCreatorName == this.name) {
                return true;
            }
        }
        return false;
    }
    public updateToken(token: string) {
        this.token = token
        firebase.database().ref("users/" + this.uid).update(this)
    }
}