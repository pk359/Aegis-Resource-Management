import { MessageBoardPage } from './../message-board-page/message-board-page';
import { Photo } from './../Model/Photo';
import { Camera } from '@ionic-native/camera';
import { PhotoHelper } from './../Utilities/photo-helper';
import { User } from './../Model/User';
import { TimeHelper } from './../Utilities/time-helper';
import { Job } from './../Model/Job';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer';


import { CurrentJobsPage } from './../current-jobs-page/current-jobs-page';
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
    public toastCtrl: ToastController, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public camera: Camera) {

    this.currentUser = JSON.parse(window.localStorage.getItem('userdetails'))
    firebase.database().ref('requests/' + this.navParams.data.jobKey).on('value', snap => {
      this.job = new Job();
      Object.assign(this.job, snap.val())
    })
    this.userRole = this.currentUser.role
    this.photoHelper = new PhotoHelper(this.currentUser.name, camera)
  }

  showInFullScreen(imageUrl) {
    this.photoViewer.show(imageUrl)
  }

  onclickApproveProcess() {
    //remove from here
    let confirm = this.alertCtrl.create({
      title: 'Confirm Request Approval?',
      message: 'Acknowledge the requested job details?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {

          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.job.approveProcess(this.currentUser);
            firebase.database().ref('requests/' + this.job.key).update(this.job)
          }
        }
      ]
    });
    confirm.present();
  }

  onclickRejectProcess() {
    //remove from here
    let confirm = this.alertCtrl.create({
      title: 'Dismiss Request Approval?',
      message: 'Remove the requested job details?',
      buttons: [
        {
          text: 'Disagree',
        },
        {
          text: 'Agree',
          handler: () => {
            this.job.approveProcess(this.currentUser);
            firebase.database().ref('requests/' + this.job.key).remove().then(_ => {
              this.navCtrl.push(CurrentJobsPage)
            })
          }
        }
      ]
    });
    confirm.present();
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
        handler: (tradespersonList) => {
          //Call assign tradesperson for each tradesperson choosen
          tradespersonList.forEach(tp => {
            console.log(JSON.parse(tp))
            job.assignTradesperson(JSON.parse(tp))
          })
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

    let confirm = this.alertCtrl.create({
      title: 'Confirm completion?',
      message: 'Agree to send job completion photo?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.photoHelper.uplaod().then(() => {
              this.photoHelper.photos.forEach(photo => {
                var p: Photo = photo;
                this.job.completionPhotos.push(p.URL);
              });

              this.job.setCompletionTime(new Date())
              firebase.database().ref("requests/" + this.job.key).update(this.job)
              this.toastCtrl.create({
                message: "upload successful",
                duration: 2
              })
            })
          }
        }
      ]
    });
    confirm.present();
  }


  onClickGoToMessageBoardButton() {
    this.navCtrl.push(MessageBoardPage, {
      key: this.job.key
    });
  }

  onClickApproveCompletion() {

    let confirm = this.alertCtrl.create({
      title: 'Confirm completion?',
      message: 'Agree to the completion of your job request?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.job.approveCompletion(this.currentUser);
            firebase.database().ref('requests/' + this.job.key).update(this.job)
          }
        }
      ]
    });
    confirm.present();
  }


}
