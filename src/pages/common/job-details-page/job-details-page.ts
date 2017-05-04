import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'job-details-page.html',
})
export class JobDetailsPage {

  jobDetails: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public photoViewer: PhotoViewer) {
    firebase.database().ref('request/' + this.navParams.data.jobKey).once('value', snap => {
      this.jobDetails.push(snap.val());
      console.log(this.jobDetails)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagerJobDetailsPage');
  }
  showInFullScreen(imageUrl) {
    this.photoViewer.show(imageUrl)
  }

}
