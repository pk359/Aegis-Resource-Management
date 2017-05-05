import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../../common/login-page/login-page'
import { JobDetailsPage } from '../../common/job-details-page/job-details-page'
import { TPProgressUpdatePage } from '../tp-progress-update-page/tp-progress-update-page'

@Component({
  templateUrl: 'tp-current-jobs-page.html',
})
export class TPCurrentJobsPage {

  cUser: any
  ref: any
  currentJobs: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) { }

  ionViewCanEnter() {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    if (!this.cUser) {
      return false;
    }
    console.log('tp current jobs can enter')
    this.ref = firebase.database().ref('request');
    this.ref.on('value', snap => {
      this.currentJobs = []
      if (snap.val()) {
        Object.keys(snap.val()).forEach(key => {
          if (snap.val()[key].progress.tpAssigned) {
            if (this.cUser.uid in snap.val()[key].progress.tpAssigned) {
              this.currentJobs.push(snap.val()[key]);
            }
          }
        })
      }
    })
  }
  ionViewCanLeave(){
    this.ref = null;
  }

  showDetailsPage(key) {
    console.log(key)
    this.navCtrl.push(JobDetailsPage, {
      jobKey: key
    });
  }
  updateProgressPage(key) {
    this.navCtrl.push(TPProgressUpdatePage, {
      jobKey: key,
    })
  }

  logout() {
    this.af.auth.logout().then(() => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }

}
