import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {InvoicePage} from '../invoice-page/invoice-page'
@Component({
  templateUrl: 'job-progress-page.html',
})
export class ManagerJobProgressPage {

  progress: any = []
  ref: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public photoViewer: PhotoViewer, public alertCtrl: AlertController) {
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

  sendInvoice() {
   this.navCtrl.push(InvoicePage, {jobs: this.navParams.data.jobs})
  }

  showImageInFullScreen(url) {
    this.photoViewer.show(url)
  }

  ionViewWillLeave() {
    this.ref = null;
  }

}
