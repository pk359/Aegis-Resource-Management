import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'client-job-progress-page.html',
})
export class ClientJobProgressPage {

  progress: any = []
  ref: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public photoViewer: PhotoViewer, public alertCtrl: AlertController) {
    console.log(navParams.data.jobKey)
  }

  ionViewCanEnter() {
    this.ref = firebase.database().ref('request/' + this.navParams.data.jobKey + '/progress');
    this.ref.on('value', snap => {
      console.log(snap.val())
      this.progress = []
      var tempD = snap.val()
      //firebase returns object, but ngfor can only accept arrays so we create an array here.
      if (tempD.tpAssigned.status) {
        var tpObject = tempD.tpAssigned.workers
        tempD.tpAssigned.workers = []
        Object.keys(tpObject).forEach(k => {
          tempD.tpAssigned.workers.push(tpObject[k]);
        })
      }
      this.progress.push(tempD)
    })
  }
  showImageInFullScreen(imageUrl) {
    this.photoViewer.show(imageUrl)
  }

  setClientApproved() {
    if (this.progress[0].tpDone) {
      var alert = this.alertCtrl.create({
        title: 'Please confirm',
        message: 'Have you done all the jobs in the request listing?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              firebase.database().ref('request/' + this.navParams.data.jobKey + '/progress/').update({
                clientApproved: { status: true, timestamp: this.getCurrentTime() }
              })
            }
          }
        ]
      });
      alert.present();
    } else {
      var alert = this.alertCtrl.create({
        title: 'Wait, ',
        message: 'Let worker finish job first.',
        buttons: ['Okay']
      })
      alert.present();
    }
  }

  getCurrentTime() {
    var date = new Date();
    var newDate = new Date(8 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
    var ampm = newDate.getHours() < 12 ? ' AM' : ' PM';
    var strDate = newDate + '';
    return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm
  }
  ionViewWillLeave() {
    this.ref = null;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientJobProgressPage');
  }

}
