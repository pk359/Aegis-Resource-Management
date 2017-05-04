import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import firebase from 'firebase'
@Component({
  templateUrl: 'job-progress-page.html',
})
export class ManagerJobProgressPage {

  progress: any = []
  ref: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    console.log(navParams.data.jobKey)
  }

  ionViewCanEnter() {
    this.ref = firebase.database().ref('request/' + this.navParams.data.jobKey + '/progress');
    this.ref.on('value', snap => {
      this.progress = []
      var tempD = snap.val()
      if (tempD.tpAssigned) {
        var tpObject = tempD.tpAssigned
        tempD.tpAssigned = []
        Object.keys(tpObject).forEach(k => {
          tempD.tpAssigned.push(tpObject[k]);
        })
      }
      this.progress.push(tempD)
    })
  }

  ionViewWillLeave() {
    this.ref = null;
  }

}
