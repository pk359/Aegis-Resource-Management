import { User } from './../Model/User';
export class UserHelper {
    private static user: User

    public static getCurrentUser() {
        if (this.user == undefined) {
            this.user = new User();
            Object.assign(this.user, JSON.parse(window.localStorage.getItem('userdetails')));
        }
        return this.user;
    }
    public static setCurrentUser(user: User) {
        this.user = user;
        window.localStorage.setItem('userdetails', JSON.stringify(user))
    }
}