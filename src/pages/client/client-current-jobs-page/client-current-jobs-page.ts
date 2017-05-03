import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { ClientJobProgressPage } from '../client-job-progress-page/client-job-progress-page'
import { JobDetailsPage } from '../../common/job-details-page/job-details-page'
import {LoginPage } from '../../common/login-page/login-page'

@Component({
  templateUrl: 'client-current-jobs-page.html',
})
export class ClientCurrentJobsPage {

  cUser: any
  currentJobs: any = []
  ref: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    // console.log(this.currentJobs)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientCurrentJobsPage');
  }
  ionViewCanEnter() {
    console.log('current jobs can enter')
    this.ref = firebase.database().ref('request').orderByChild('clientUid').equalTo(this.cUser.uid);
    this.ref.on('value', snap => {
      this.currentJobs = []
      var tempData = {}
      Object.keys(snap.val()).forEach(key => {
        tempData = snap.val()[key];
        tempData['key'] = key;
        this.currentJobs.push(tempData);
      })
      console.log(this.currentJobs)
    })
  }
  ionViewWillLeave(){
    console.log('current jobs will leave')
    this.ref = null;
  }
  showDetailsPage(key) {
    console.log(key)
    this.navCtrl.push(JobDetailsPage, {
      jobKey: key
    });
  }

  showProgresPage(key) {
    this.navCtrl.push(ClientJobProgressPage, {
      jobKey: key
    });
  }

  logout() {
    this.af.auth.logout().then(()=>{
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage)
    })
  }

}
