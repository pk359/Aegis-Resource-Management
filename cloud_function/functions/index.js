var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const sendToTopic = function sendToTopic(topic, title, data, body = 'Press me to view detail') {
    const payLoad = {
        notification: {
            title: title,
            body: body,
            sound: "default"
        },
        data: data
    };

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 2
    };
    console.log('sending notification to ' + topic + ' topic!')
    return admin.messaging().sendToTopic(topic, payLoad, options);
}
const sentToDevice = function sendToDevice(token, title, data, body) {
    const payLoad = {
        notification: {
            title: title,
            body: body,
            sound: "default"
        },
        data: data
    };

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 2
    };
    return admin.messaging().sendToDevice(token, payLoad, options)
}
const sendToUsers = function sendToUsers(uids, title, data, body) {
    let promisses = []
    let getUidPromisses = []
    uids.forEach(uid => {
        getUidPromisses.push(admin.database().ref(`/users/${uid}/token`).once('value'))
    })
    Promise.all(getUidPromisses).then(results => {
        results.forEach(result => {
            let token = result.val()
            promisses.push(sentToDevice(token, title, data, body = body))
        })
    })
    console.log('sending to ' + uids.length + ' user');
    return Promise.all(promisses);
}
const getTradespersonUids = function getTradespersonUids(job) {
    uids = []
    job.tradespersonList.forEach(function (user) {
        uids.push(user.uid)
    }, this);
    return uids;
}
const sendToTradespersons = function sendToTradespersons(job, title, data, body = 'Press me to view detail') {
    return sendToUsers(getTradespersonUids(job), title, data, body)
}
const sendToClient = function sendToClient(job, title, data, body = 'Press me to view detail') {
    console.log('sending notification to client')
    return sendToUsers([job.jobCreatorUid], title, data, body = body);
}
exports.general = functions.database.ref('/requests/{pushId}/').onWrite(event => {
    const requestKey = event.params.pushId
    if (!event.data.val()) {
        return console.log('request ' + requestKey + " was deleted");
    }
    if (!event.data.previous.exists()) {
        return sendToTopic('manager', 'A new Request has been posted!', {
            key: requestKey
        })
    }
    const oldJob = event.data.previous.val();
    const newJob = event.data.val()
    let data = {
        key: requestKey,
        page: 'detail'
    }
    let promisses = []
    if (oldJob.tradespersonAssignmentTime != newJob.tradespersonAssignmentTime) {
        promisses.push(sendToTopic('manager', 'A request has been assigned and dispatched!', data))
        promisses.push(sendToTradespersons(newJob, 'You have been assigned to a new job!', data));
    } else if (oldJob.checkInTime != newJob.checkInTime) {
        promisses.push(sendToTopic('manager', 'A tradesperson has chanked in to a request!', data))
        promisses.push(sendToClient(newJob, 'Tradesperson has checked in to your request!', data))
    } else if (oldJob.completionTime != newJob.completionTime) {
        promisses.push(sendToTopic('manager', 'A tradesperson has mark a request as complete!', data))
        promisses.push(sendToClient(newJob, 'Tradesperson has completed your request please for approval!', data))
    } else if (oldJob.completionApprovalTime != newJob.completionApprovalTime) {
        promisses.push(sendToTopic('manager', 'A request completion has been aprroved!', data))
        promisses.push(sendToTradespersons(newJob, 'Your completion has been approved. Well done!', data));
    }
    return Promise.all(promisses)
});
exports.messageboard = functions.database.ref('/requests/{requestID}/messageBoard/messages/{messageIndex}/').onWrite(event => {
    if (event.data.previous.exists()) {
        return;
    }
    const requestKey = event.params.requestID
    const messageIndex = event.params.messageIndex;
    let promisses = []
    const sender = event.data.val().sender;
    const text = event.data.val().text;
    let data = {
        key: requestKey,
        page: 'messageboard'
    }
    admin.database().ref('/requests/' + requestKey).once('value').then(result => {
        const job = result.val()
        promisses.push(sendToTopic('manager', sender + ' has posted on messageboard', data, body = text))
        uids = []
        job.tradespersonList.forEach(user => {
            if (user.name != sender) {
                uids.push(user.uid)
            }
        })
        promisses.push(sendToUsers(uids, sender + ' has posted on messageboard', data, body = text));
        if (job.jobCreatorName != sender) {
            promisses.push(sendToClient(job, sender + ' has posted on messageboard', data, body = text))
        }
    })
    return Promise.all(promisses)
})
