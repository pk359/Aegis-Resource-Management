import { InvoicePage } from './../../manager/invoice-page/invoice-page';
import { MessageBoardPage } from './../message-board-page/message-board-page';
import { Photo } from './../Model/Photo';
import { Camera } from '@ionic-native/camera';
import { PhotoHelper } from './../Utilities/photo-helper';
import { User } from './../Model/User';
import { TimeHelper } from './../Utilities/time-helper';
import { Job } from './../Model/Job';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'job-details-page.html',
})
export class JobDetailsPage {

  job: Job = undefined;
  timeHelper: TimeHelper = new TimeHelper();
  currentUser
  userRole = undefined
  photoHelper: PhotoHelper
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public photoViewer: PhotoViewer,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public camera: Camera) {

    this.currentUser = JSON.parse(window.localStorage.getItem('userdetails'))
    firebase.database().ref('requests/' + this.navParams.data.jobKey).on('value', snap => {
      this.job = new Job();
      Object.assign(this.job, snap.val())
    })
    this.userRole = this.currentUser.role
    this.photoHelper = new PhotoHelper(this.currentUser.name, camera)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagerJobDetailsPage');
  }
  showInFullScreen(imageUrl) {
    this.photoViewer.show(imageUrl)
  }

  onclickApproveProcess() {
    this.job.approveProcess(this.currentUser);
    var alert = this.alertCtrl.create({
      title: "Approving..",
    })
    alert.present()
    firebase.database().ref('requests/' + this.job.key).update(this.job).then(a => {
      alert.dismiss()
    })
  }
  public assignTradesperson(job: Job) {
    var tps: User[] = []
    firebase.database().ref('users/').orderByChild('role').equalTo('tradesperson').once('value', snap => {
      if (snap.val() != null) {
        Object.keys(snap.val()).forEach(key => {
          var tp = snap.val()[key];
          tps.push(tp)
        })
      }
    }).then(() => {
      if (tps.length <= 0) {
        this.toastCtrl.create({
          message: "There is no Tradesperson registered!",
          duration: 2
        }).present()
      }
      let alert = this.alertCtrl.create({
        title: 'Select Tradesperson',
        message: 'You can assign multiple people to one job.',
        enableBackdropDismiss: false
      });
      tps.forEach(tp => {
        alert.addInput({
          type: 'checkbox',
          label: tp.name,
          value: JSON.stringify(tp),
          checked: false
        });
      });
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Okay',
        handler: jsonString => {
          var tp: User = JSON.parse(jsonString)
          job.assignTradesperson(tp)
          firebase.database().ref('requests/' + job.key).update(job).then(() => {
            this.showToast('Workers have been assigned successfully.');
          })
        }
      });
      alert.present();
    });
  }
  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: false
    }).present();
  }
  takeCheckinPhoto() {
    this.photoHelper.snap();
  }
  checkin() {
    var alert = this.alertCtrl.create({
      title: "Checking in",
      message: "Please wait.."
    })
    alert.present()
    this.photoHelper.uplaod().then(() => {
      this.photoHelper.photos.forEach(photo => {
        var p: Photo = photo;
        this.job.checkInPhotos.push(p.URL);
      });
      this.job.setCheckInTime(new Date())
      firebase.database().ref("requests/" + this.job.key).update(this.job).then(() => {
        alert.dismiss()
        this.toastCtrl.create({
          message: "You have checked in",
          duration: 2
        }).present()
        this.photoHelper.photos = []
      })
    })
  }
  takeCompletionPhoto() {
    this.photoHelper.snap();
  }
  confirmCompletion() {
    var alert = this.alertCtrl.create({
      title: "Uploading, please wait..",
    })
    alert.present()
    this.photoHelper.uplaod().then(() => {
      this.photoHelper.photos.forEach(photo => {
        var p: Photo = photo;
        this.job.completionPhotos.push(p.URL);
      });
      this.job.setCompletionTime(new Date())
      firebase.database().ref("requests/" + this.job.key).update(this.job).then(() => {
        alert.dismiss()
        this.toastCtrl.create({
          message: "upload successful",
          duration: 2
        })
      })
    })
  }
  onClickGoToMessageBoardButton() {
    this.navCtrl.push(MessageBoardPage, {
      key: this.job.key
    });
  }
  onClickApproveCompletion() {
    this.job.approveCompletion(this.currentUser);
    var alert = this.alertCtrl.create({
      title: "Approving..",
    })
    alert.present()
    firebase.database().ref('requests/' + this.job.key).update(this.job).then(a => {
      alert.dismiss()
    })
  }
  sendInvoice() {
    this.navCtrl.push(InvoicePage, { job: this.job })
  }
}
