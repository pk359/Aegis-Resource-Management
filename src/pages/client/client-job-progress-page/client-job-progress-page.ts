import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'client-job-progress-page.html',
})
export class ClientJobProgressPage {

  progress: any = []
  ref: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public photoViewer: PhotoViewer) {
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
  showImageInFullScreen(imageUrl){
    this.photoViewer.show(imageUrl)
  }
  ionViewWillLeave() {
    this.ref = null;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientJobProgressPage');
  }

}
