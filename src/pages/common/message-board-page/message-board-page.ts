import { Camera } from '@ionic-native/camera';
import { PhotoHelper } from './../Utilities/photo-helper';
import { TimeHelper } from './../Utilities/time-helper';
import { Message } from './../Model/Message';
import { Job } from './../Model/Job';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
@Component({
  templateUrl: 'message-board-page.html',
})
export class MessageBoardPage {
  cUser: any;
  ref: any;
  job: Job;
  currentMessage: string = ""
  photoHelper: PhotoHelper
  constructor(public af: AngularFire, public alertCtrl: AlertController, public navCtrl: NavController,
    public navParams: NavParams, public toastCtrl: ToastController, public camera: Camera) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    this.job = navParams.data;

    this.photoHelper = new PhotoHelper(this.cUser.name, this.camera);
    firebase.database().ref("requests/" + this.job.key + "")
  }

  postMessage() {
    var m = new Message(this.currentMessage, this.cUser.name);
    m.time = new TimeHelper().getCurrentTime();
    this.job.getMessageBoard().addMessage(m);
    if (this.photoHelper.photos.length > 0) {
      this.photoHelper.uplaod(() => {
        m.imageUrl = this.photoHelper.photos[0].URL;
        firebase.database().ref('requests/' + this.job.key + '/messageBoard').update(this.job.getMessageBoard()).then(() => {
        })
      })
    } else {
      firebase.database().ref('requests/' + this.job.key + '/messageBoard').update(this.job.getMessageBoard()).then(() => {
      })
    }
  }
  takePicture() {
    var m = new Message(this.currentMessage, this.cUser.name);
    m.time = new TimeHelper().getCurrentTime();
    this.photoHelper.photos = []
    this.photoHelper.snap();
  }
}
