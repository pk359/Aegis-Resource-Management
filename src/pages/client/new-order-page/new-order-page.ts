import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {ClientCurrentJobsPage} from '../client-current-jobs-page/client-current-jobs-page'
@Component({
  templateUrl: 'new-order-page.html',
})
export class NewOrderPage {

  snapped: any
  jobs: any
  jobData: any
  firebaseJobObject: any = {}
  servicePictures: any = []
  serviceName = ''
  color = 'rgba(0, 0, 0, 0.18)'
  progress = 0
  error = ''
  cUser: any
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFire,
    public modalCtrl: ModalController, public camera: Camera,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public photoViewer: PhotoViewer, public alertCtrl: AlertController) {

    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    this.snapped = [], this.jobs = []
    this.jobData = {
      key: '',
      clientName: '',
      clientUid: '',
      jobs: [],
      description: '',
      room: '',
      placedOn: '',
      completed: false,
      photosByClient: [],
      progress: {
        aegisApproved: {status: false},
        tpAssigned:{status: false, workers: []},
        checkedIn:  {status: false},
        photosBefore: {status: false, photos: []},
        photosAfter: {status: false, photos: []},
        tpDone: {status: false},
        clientApproved: {status: false},
        invoiceSent: {status: false},
        followUp: [{author: '', message: ''}]
      }
    }
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

  showJobs() {
    var alert = this.alertCtrl.create({
      title: 'All services...',
      message: 'Select atleast one service',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'Done',
        handler: data => {
          this.jobData.jobs = data;
          this.color = data.length > 0 ? 'rgb(35, 187, 166)' : '';
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    })
    var serviceOffered = ['Painting', 'Marble Polishing', 'Spray Varnishing', 'Resurfacing', 'Grouting',]
    serviceOffered.forEach(s => {
      alert.addInput({
        type: 'checkbox',
        label: s,
        value: s,
        // checked
      })
    })
    alert.present();
  }


  snap(job) {
    this.camera.getPicture(this.options).then(data => {
      this.snapped.push({ image: data, time: this.getCurrentDate() });
    }, (err) => {
      console.log(err)
    });
  }

  placeRequest() {
    this.error = '';
    if (this.jobData.room === '' ||
      this.jobData.floor === '' ||
      this.jobData.building === '') {
      this.error = 'All fileds are necessary';
    } else if (this.jobData.jobs.length == 0) {
      this.error = 'Please select atleast one job.'
    } else if (this.snapped.length == 0) {
      this.error = 'Please add atleast one photo';
    }
    if (this.error == '') this.saveRequestToFirebase();
  }

  saveRequestToFirebase() {
    var count = 0;
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: 'crescent',
      content: 'Sending request to aegis, please wait...'
    });
    loading.present();
    var ref = firebase.storage().ref();

    this.snapped.forEach((item, i) => {
      var task = ref.child('images/' + this.cUser.name + '/' + item.time + '.jpg').putString(item.image, 'base64');
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
          this.jobData.photosByClient.push(task.snapshot.downloadURL);
          if (++count == this.snapped.length) {

            var currentDate = this.getCurrentDate();
            this.jobData.clientName = this.cUser.name;
            this.jobData.clientUid = this.cUser.uid;
            this.jobData.placedOn = currentDate;

            var reqRef = firebase.database().ref('request/').push()
            this.jobData.key = reqRef.key;
            reqRef.set(this.jobData).then(r => {
              loading.dismiss();
              this.toastCtrl.create({
                message: 'Your order has been placed successfully.',
                duration: 4000,
                position: 'middle',
                showCloseButton: true,
                dismissOnPageChange: false
              }).present();
              this.jobData.room = ''
              this.jobData.jobs = []
              this.snapped = []
              this.jobData.description = ''
            }).catch(r => {
              console.log(r);
            })
          }
        });
    })
    console.log(this.jobData);
  }
  showInFullScreen(imageUrl) {
    this.photoViewer.show(imageUrl)
  }
  getCurrentDate() {
    var date = new Date();
    var newDate = new Date(8 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
    var ampm = newDate.getHours() < 12 ? ' AM' : ' PM';
    var strDate = newDate + '';
    return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm
  }
}

