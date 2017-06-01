export class TimeHelper {
    getCurrentTime() {
        var date = new Date();
        var newDate = new Date(8 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
        var ampm = newDate.getHours() < 12 ? ' AM' : ' PM';
        var strDate = newDate + '';
        return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm
    }
    static formatDate(date: Date) {
        var ampm = date.getHours() < 12 ? ' AM' : ' PM';
        var strDate = date + '';
        return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm
    }
}