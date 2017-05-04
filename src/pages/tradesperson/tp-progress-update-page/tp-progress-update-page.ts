import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  templateUrl: 'tp-progress-update-page.html',
})
export class TPProgressUpdatePage {

  cUser: any
  ref: any
  progress: any = []

  snapped: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire,public camera: Camera,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
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
    allowEdit: true
  }

  ionViewCanEnter() {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    if (!this.cUser) {
      return false;
    }
    console.log('tp current jobs can enter')
    this.ref = firebase.database().ref('request/' + this.navParams.data.jobKey + '/progress');
    this.ref.on('value', snap => {
      console.log(snap.val())
      this.progress = []
      this.progress.push(snap.val())
      console.log(this.progress)
    })
  }

  snap() {
    this.camera.getPicture(this.options).then(data => {
      this.snapped.push({ image: data, time: this.getCurrentDate() });
    }, (err) => {
      console.log(err)
    });
  }

  savePicturesBeforeService() {
    
  }
   getCurrentDate() {
    var date = new Date();
    var newDate = new Date(8 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
    var ampm = newDate.getHours() < 12 ? ' AM' : ' PM';
    var strDate = newDate + '';
    return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm
  }
}
