import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import firebase from 'firebase'
@Component({
  templateUrl: 'job-progress-page.html',
})
export class ManagerJobProgressPage {

  progress: any = []
  ref:any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    console.log(navParams.data.jobKey)
  }

  ionViewCanEnter(){
    this.ref = firebase.database().ref('request/'+this.navParams.data.jobKey+'/progress');
    this.ref.on('value', snap => {
      this.progress = []
      var tempData = {}
      Object.keys(snap.val()).forEach(key => {
        tempData = snap.val()[key];
        tempData['key'] = key;
        this.progress.push(tempData);
      })
      console.log(this.progress)
    })
  }

  ionViewWillLeave(){
    this.ref = null;
  }

}
