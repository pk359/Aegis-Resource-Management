import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { ClientJobProgressPage } from '../client-job-progress-page/client-job-progress-page'
import { JobDetailsPage } from '../../common/job-details-page/job-details-page'

@Component({
  templateUrl: 'client-current-jobs-page.html',
})
export class ClientCurrentJobsPage {

  cUser: any
  currentJobs: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));

    firebase.database().ref('request/').orderByChild('clientUid').equalTo(this.cUser.uid).on('value', snap => {
      this.currentJobs = []
      this.currentJobs.push(snap.val())
      console.log(this.currentJobs)
    })
    // console.log(this.currentJobs)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientCurrentJobsPage');
  }
  showDetailsPage(key) {
    this.navCtrl.push(JobDetailsPage, {
      jobKey: key
    });
  }

  showProgresPage(key) {
    this.navCtrl.push(ClientJobProgressPage, {
      jobKey: key
    });
  }

}
