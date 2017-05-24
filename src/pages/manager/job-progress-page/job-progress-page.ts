import { Job } from './../../common/Model/Job';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { InvoicePage } from '../invoice-page/invoice-page'
import { FollowUpPage } from '../../common/follow-up-page/follow-up-page'
@Component({
  templateUrl: 'job-progress-page.html',
})
export class ManagerJobProgressPage {
  ref: any
  job: Job
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public photoViewer: PhotoViewer, public alertCtrl: AlertController) {
    console.log(navParams.data.jobKey)
  }

  ionViewCanEnter() {
    this.ref = firebase.database().ref('requests/' + this.navParams.data.jobKey + '/progress');
    this.ref.on('value', snap => {
      var job: Job = new Job()
      Object.assign(job, snap.val());
      this.job = job
    })
  }

  sendInvoice() {
    this.navCtrl.push(InvoicePage, { jobs: this.navParams.data.jobs, jobTitle: this.navParams.data.jobTitle })
  }

  showImageInFullScreen(url) {
    this.photoViewer.show(url)
  }

  ionViewWillLeave() {
    this.ref = null;
  }

}
