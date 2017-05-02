import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import firebase from 'firebase'
@Component({
  templateUrl: 'job-progress-page.html',
})
export class ManagerJobProgressPage {

  progress: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    console.log(navParams.data.jobKey)
    firebase.database().ref('request/' + navParams.data.jobKey + '/progress').on('value', snap => {
      this.progress=[]
      this.progress.push(snap.val())
      console.log(this.progress)
    })
  }

  ionViewDidLoad() {

  }

}
