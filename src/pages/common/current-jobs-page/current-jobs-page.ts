import { Job } from './../Model/Job';
import { UserHelper } from './../../common/Utilities/user-helper';
import { User } from './../../common/Model/User';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { JobDetailsPage } from '../../common/job-details-page/job-details-page'

@Component({
  templateUrl: 'current-jobs-page.html',
})
export class CurrentJobsPage {
  currentJobs: Job[] = []
  ref: any
  cUser: User
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.cUser = UserHelper.getCurrentUser()
    firebase.database().ref('requests').orderByChild('completionApproval').equalTo(null).on('value', snap => {
      this.currentJobs = []
      if (snap.val()) {
        Object.keys(snap.val()).forEach(key => {
          var job: Job = new Job();
          job.isCompletionApproved()
          Object.assign(job, snap.val()[key])
          if (this.cUser.hasAccessToJob(job) && !job.isApproveforProcess() && this.cUser.role != 'headAegis') {
            this.currentJobs.push(job)
          } else if (this.cUser.hasAccessToJob(job) && job.isApproveforProcess()) {
            this.currentJobs.push(job)
          }
        })
      }
      this.currentJobs = this.currentJobs.reverse()
    })
  }

  ionViewCanLeave() {
    this.ref = null;
  }

  showDetailsPage(key) {
    this.navCtrl.push(JobDetailsPage, {
      jobKey: key
    });
  }
}
