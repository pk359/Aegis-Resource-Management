import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FollowUpPage } from '../../common/follow-up-page/follow-up-page'
@Component({
  templateUrl: 'tp-progress-update-page.html',
})
export class TPProgressUpdatePage {

  cUser: any
  ref: any
  progress: any = []
  snapped: any = []
  snappedBefore: any
  snappedAfter: any
  error: any = ''
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public camera: Camera,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public photoViewer: PhotoViewer) {
    this.snappedBefore = []
    this.snappedAfter = []
    this.snapped = []
  }

  options: CameraOptions = {
    quality: 95,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true,
    correctOrientation: true,
    targetHeight: 700,
    targetWidth: 700,
    allowEdit: true
  }

  ionViewCanEnter() {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    if (!this.cUser) {
      return false;
    }
    console.log('tp current jobs can enter')
    this.ref = firebase.database().ref('requests/' + this.navParams.data.jobKey + '/progress');
    this.ref.on('value', snap => {
      this.progress = []
      if (!snap.val().clientApproved.status) {
        this.progress.push(snap.val())
      }
      if (this.progress.length == 0) {
        var alert = this.alertCtrl.create({
          title: 'No Jobs',
          message: 'No jobs for you yet',
          buttons: ['okay']
        })
        alert.present();
      }
    })
  }
  ionViewCanLeave() {
    this.ref = null;
  }

  markCheckedInTP() {
    if (!this.progress[0].checkedIn.status) {
      let alert = this.alertCtrl.create({
        title: 'Please confirm',
        message: 'Have you checked in already?',
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
                checkedIn: { status: true, timestamp: this.getCurrentDate() }
              }).then(() => {
                this.showToast('Your status is updated to checked in.');
              })
            }
          }
        ]
      });
      alert.present();
    }

  }

  markJobDoneTP() {
    if (this.progress[0].photosBefore.status && this.progress[0].photosAfter.status && this.progress[0].checkedIn.status) {
      var alert = this.alertCtrl.create({
        title: 'Please confirm',
        message: 'Have you done all the jobs in the request listing?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              firebase.database().ref('request/' + this.navParams.data.jobKey + '/progress/').update({
                tpDone: { status: false, timestamp: this.getCurrentDate() }
              })
            }
          },
          {
            text: 'Yes',
            handler: () => {
              firebase.database().ref('request/' + this.navParams.data.jobKey + '/progress/').update({
                tpDone: { status: true, timestamp: this.getCurrentDate() }
              }).then(() => {
                this.showToast('Job is marked done now. Wait for client to approve work.');
              })
            }
          }
        ]
      });
      alert.present();
    } else {
      var alert = this.alertCtrl.create({
        title: 'Confirm?',
        message: 'Please complete previous tasks first',
        buttons: ['Okay']
      })
      alert.present();
    }
  }

  snap(before) {
    this.camera.getPicture(this.options).then(data => {
      if (before) {
        this.snappedBefore.push({ image: data, time: this.getCurrentDate() });
      } else if (!before) {
        this.snappedAfter.push({ image: data, time: this.getCurrentDate() });
      }
    }, (err) => {
      console.log(err)
    });
  }

  savePictures(before) {
    var url = ''
    var photos = []
    if (before && this.snappedBefore.length > 0) {
      this.snapped = this.snappedBefore;
      this.snappedBefore = []

      if (this.progress[0].photosBefore.status) {
        photos = this.progress[0].photosBefore.photos;
      }
      url = 'request/' + this.navParams.data.jobKey + '/progress/photosBefore'
      this.savePictureToFire(photos, url)
    } else if (!before && this.snappedAfter.length > 0) {
      this.snapped = this.snappedAfter;
      this.snappedAfter = []
      if (this.progress[0].photosAfter.status) {
        photos = this.progress[0].photosAfter.photos;
      }
      url = 'request/' + this.navParams.data.jobKey + '/progress/photosAfter'
      this.savePictureToFire(photos, url)
    } else {
      let alert = this.alertCtrl.create({
        title: 'No photos to save',
        subTitle: 'Please add some photos and then hit save',
        buttons: ['Okay']
      });
      alert.present();
    }
  }

  savePictureToFire(photos, url) {
    var count = 0;
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: 'crescent',
      content: 'Sending request to aegis, please wait...'
    });
    loading.present();

    var ref = firebase.storage().ref();
    this.snapped.forEach((item, i) => {
      var task = ref.child('images/tp/' + this.cUser.name + '/' + item.time + '.jpg').putString(item.image, 'base64');
      // Listen for state changes, errors, and completion of the upload.
      task.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              loading.setContent('Waiting for internet... ')
              break;
          }
        }, function (error) {
          console.log(error)
        }
        , () => {
          // Upload completed successfully, now we can get the download URL
          photos.push(task.snapshot.downloadURL);
          if (++count == this.snapped.length) {
            var reqRef = firebase.database().ref(url);
            reqRef.set({ status: true, photos: photos, timestamp: this.getCurrentDate() }).then(r => {
              loading.dismiss();
              this.toastCtrl.create({
                message: 'Photos are saved now.',
                duration: 3000,
                position: 'bottom',
                dismissOnPageChange: false
              }).present();
            }).then(() => {
              this.snapped = []
            }).catch(r => {
              console.log(r);
            })
          }
        });
    })
  }

  showImageInFullScreen(url) {
    this.photoViewer.show(url)
  }
  getCurrentDate() {
    var date = new Date();
    var newDate = new Date(8 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
    var ampm = newDate.getHours() < 12 ? ' AM' : ' PM';
    var strDate = newDate + '';
    return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm
  }
  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false
    }).present();
  }
}
