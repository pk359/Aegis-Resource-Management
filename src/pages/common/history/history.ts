import { Job } from './../Model/Job';
import { UserHelper } from './../../common/Utilities/user-helper';
import { User } from './../../common/Model/User';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { JobDetailsPage } from '../../common/job-details-page/job-details-page'

@Component({
    templateUrl: 'history.html',
})
export class Historypage {
    currentJobs: Job[] = []
    ref: any
    cUser: User
    constructor(public navCtrl: NavController, public navParams: NavParams,
        public af: AngularFire, public toastCtrl: ToastController, public alertCtrl: AlertController) {
        this.cUser = UserHelper.getCurrentUser()
        firebase.database().ref('requests').orderByChild('completionApproval').on('value', snap => {
            this.currentJobs = []
            if (snap.val()) {
                Object.keys(snap.val()).forEach(key => {
                    var job: Job = new Job();
                    Object.assign(job, snap.val()[key])
                    if (job.isCompletionApproved())
                        this.currentJobs.push(job)
                })
            }
            this.currentJobs = this.currentJobs.reverse()
        })
    }

    showDetailsPage(key) {
        this.navCtrl.push(JobDetailsPage, {
            jobKey: key
        });
    }
    isMobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true
        }
        else {
            return false
        }
    }
    onClickDownloadCSV() {
        var converter = require('json-2-csv');

        var options = {
            delimiter: {
                field: ',', // Comma field delimiter
                array: ';', // Semicolon array value delimiter
                eol: '\n' // Newline delimiter
            },
            prependHeader: true,
            sortHeader: false,
            trimHeaderValues: true,
            trimFieldValues: true,
            keys: ['building', 'room', 'jobCreationTime', 'jobCreatorName', 'serviceList', 'description', 'processApproval.name', 'processApprovalTime', 'tradespersonList', 'tradespersonAssignmentTime', 'checkInTime', 'completionTime', 'completionApprovalTime']
        };

        var documents = []
        firebase.database().ref('requests/').once('value', datasnapshot => {
            if (datasnapshot.val()) {
                Object.keys(datasnapshot.val()).forEach(key => {
                    var job: Job = new Job()
                    Object.assign(job, datasnapshot.val()[key])
                    var obj: any = {}
                    Object.assign(obj, datasnapshot.val()[key]);
                    obj.tradespersonList = [];
                    job.tradespersonList.forEach(user => {
                        const u = new User();
                        Object.assign(u, user);
                        obj.tradespersonList.push(u.name)
                    })
                    documents.push(obj)
                })
            }

            var json2csvCallback = function (err, csv) {
                if (err) throw err;
                var csvContent = "data:text/csv;charset=utf-8,"
                csvContent += csv
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "my_data.csv");
                document.body.appendChild(link); // Required for FF
                link.click(); // This will download the data file named "my_data.csv".
            }

            converter.json2csv(documents, json2csvCallback, options);
        })
    }
}