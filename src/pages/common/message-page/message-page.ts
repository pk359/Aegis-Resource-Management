import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../login-page/login-page'
import { UIDecider } from '../ui-decider/ui-decider'
@Component({
  templateUrl: 'message-page.html',
})
export class MessagePage {
  message: string;
  cUser: any;
  ref: any;
  constructor(public af: AngularFire, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.message = navParams.get('message')
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    this.ref = firebase.database().ref().child('users/' + this.cUser.uid).on('value', snap => {
      if (snap.val().role != 'none') {
        this.redirectToUIDecider(snap.val().role);
      }
    });
  }
  redirectToUIDecider(role) {
    this.ref = null;
    window.localStorage.removeItem('userdetails');
    window.localStorage.setItem('userdetails', JSON.stringify({
      name: this.cUser.name,
      role: role,
      uid: this.cUser.uid,
    }))
    let prompt = this.alertCtrl.create({
      title: 'Congratulations',
      message: "You are " + role + " now. Please Login again.",
      buttons: [
        {
          text: 'Okay',
          handler: data => {
            console.log('Okay Clicked');
          }
        }
      ]
    });
    prompt.present();
    this.navCtrl.push(UIDecider)
  }

}
