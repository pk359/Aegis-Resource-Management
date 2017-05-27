import { UserHelper } from './../Utilities/user-helper';
import { User } from './../Model/User';
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
  cUser: User;
  ref: any;
  currentMessage: string = ""
  photoHelper: PhotoHelper
  messages: Message[] = []
  jobKey: string
  constructor(public af: AngularFire, public alertCtrl: AlertController, public navCtrl: NavController,
    public navParams: NavParams, public toastCtrl: ToastController, public camera: Camera) {
    this.cUser = UserHelper.getCurrentUser()
    this.jobKey = navParams.data.key;
    firebase.database().ref("requests/" + this.jobKey + "/messageBoard/messages/").on('value', snap => {
      console.log(snap.val())
      if (snap.exists()) {
        this.messages = []
        Object.keys(snap.val()).forEach(m => {
          let msg = new Message();
          Object.assign(msg, m)
          this.messages.push(msg)
        })
      }
    })
    this.photoHelper = new PhotoHelper(this.cUser.name, this.camera);
  }

  postMessage() {
    var m = new Message();
    m.sender = this.cUser.name;
    m.text = this.currentMessage
    this.currentMessage = ''
    m.setTime(new Date())
    let promisses = []
    if (this.photoHelper.photos.length > 0) {
      promisses.push(new Promise((resolve, reject) => {
        this.photoHelper.uplaod().then(() => {
          m.imageUrl = this.photoHelper.photos[0].URL;
        })
      }))
    }
    promisses.push(firebase.database().ref('requests/' + this.jobKey + '/messageBoard/messages/').push(m))
    Promise.all(promisses).catch(e => {
      console.error(e)
    })
  }
  takePicture() {
    this.photoHelper.photos = []
    this.photoHelper.snap();
  }
}
