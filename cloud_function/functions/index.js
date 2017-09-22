
var functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const sendToTopic = function sendToTopic(topic, title, data, body = 'Press me to view detail', except/*: string[]*/ = []) {
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
    // admin.messaging().sendToTopic(topic, payLoad, options);
    console.log('sending notification to ' + topic + ' topic!')
    return new Promise((resolve, reject) => {
        admin.database().ref('users/').once('value', e => {
            if (e.exists()) {
                const o = e.val();
                Object.keys(o).forEach(key => {
                    const user = o[key];
                    if (user.role === topic) {
                        if (!user.name in except) {
                            admin.messaging().sendToDevice(topic, payLoad, options);
                        }
                    }
                });
            }
            resolve();
        });
    });
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
    const uids = []
    job.tradespersonList.forEach(function (user) {
        uids.push(user.uid)
    }, this);
    return uids;
}
const sendToTradespersons = function sendToTradespersons(job, title, data, body = 'Press me to view detail') {
    return sendToUsers(getTradespersonUids(job), title, data, body)
}
const sendToHosuekeepr = function sendToHosuekeepr(job, title, data, body = 'Press me to view detail') {
    console.log('sending notification to hosuekeeper')
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
    // let topics = ['headAegis', 'housekeeper', 'tradesperson', 'headEngineer', 'sales', 'headHousekeeper']
    let promisses = []
    if (!oldJob) {
        promisses.push(sendToTopic('headEngineer', 'A new request has been created, please approve', data))
        promisses.push(sendToTopic('sales', 'A new request has been created, please approve', data))
        promisses.push(sendToTopic('headHousekeeper', newJob.jobCreatorName + ' has created a request', data))
    } else if (oldJob.processApprovalTime !== newJob.processApprovalTime) {
        promisses.push(sendToTopic('headAegis', 'An request has been confirmed, please assign tradesperson', data))
    } else if (oldJob.tradespersonAssignmentTime !== newJob.tradespersonAssignmentTime) {
        promisses.push(sendToTopic('headAegis', 'A request has been assigned and dispatched!', data))
        promisses.push(sendToTradespersons(newJob, 'You have been assigned to a new job!', data));
        promisses.push(sendToTopic('sales', 'A request has been assigned and dispatched!', data))
    } else if (oldJob.checkInTime !== newJob.checkInTime) {
        promisses.push(sendToTopic('headAegis', 'A tradesperson has checked in to a request!', data))
        promisses.push(sendToHosuekeepr(newJob, 'Tradesperson has checked in to your request!', data))
        promisses.push(sendToTopic('sales', 'A tradesperson has checked in to a request!', data))
    } else if (oldJob.completionTime !== newJob.completionTime) {
        promisses.push(sendToTopic('headAegis', 'A tradesperson has mark a request as complete!', data))
        promisses.push(sendToHosuekeepr(newJob, 'Tradesperson has completed your request now waiting for approval!', data))
        promisses.push(sendToTopic('sales', 'A tradesperson has mark a request as complete!', data))
        promisses.push(sendToTopic('headHousekeeper', 'A tradesperson has mark a request as complete!', data))
        promisses.push(sendToTopic('headEngineer', 'A tradesperson has mark a request as complete! Awaits for approval', data))
    } else if (oldJob.completionApprovalTime !== newJob.completionApprovalTime) {
        promisses.push(sendToTopic('headAegis', 'A request completion has been aprroved!', data))
        promisses.push(sendToTradespersons(newJob, 'Your completion has been approved. Well done!', data));
        promisses.push(sendToTopic('sales', 'A request completion has been aprroved!', data))
        promisses.push(sendToTopic('headHousekeeper', 'A request completion has been aprroved!', data))
        promisses.push(sendToTopic('headEngineer', 'A request completion has been aprroved!', data))
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
        const uids = []
        job.tradespersonList.forEach(user => {
            if (user.name != sender) {
                uids.push(user.uid)
            }
        })
        promisses.push(sendToUsers(uids, sender + ' has posted on messageboard', data, body = text));
        if (job.jobCreatorName != sender) {
            promisses.push(sendToHosuekeepr(job, sender + ' has posted on messageboard', data, body = text))
        }
        promisses.push(sendToTopic('headHousekeeper', sender + ' has posted on messageboard', data, body = text, except = [sender]))
        promisses.push(sendToTopic('headEngineer', sender + ' has posted on messageboard', data, body = text, except = [sender]))
        promisses.push(sendToTopic('headAegis', sender + ' has posted on messageboard', data, body = text, except = [sender]))

    })
    return Promise.all(promisses)
})
