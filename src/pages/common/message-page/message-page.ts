import { User } from './../Model/User';
import { UserHelper } from './../Utilities/user-helper';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
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
    this.cUser = UserHelper.getCurrentUser()
    this.ref = firebase.database().ref('users/' + this.cUser.uid).on('value', snap => {
      var user: User = new User();
      Object.assign(user, snap.val())
      UserHelper.setCurrentUser(user)
      if (user.role != 'none') {
        this.redirectToUIDecider(user.role);
      }
    });

  }
  redirectToUIDecider(role) {
    this.ref = null;
    let prompt = this.alertCtrl.create({
      title: 'Congratulations',
      message: "You are " + role + " now.",
      buttons: [
        {
          text: 'Okay',
        }
      ]
    });
    prompt.present();
    this.navCtrl.push(UIDecider)
  }

}
