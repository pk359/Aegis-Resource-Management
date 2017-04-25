import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../login-page/login-page'
@Component({
  templateUrl: 'message-page.html',
})
export class MessagePage {
  message: string;
  cUser: any;
  constructor(public af: AngularFire, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.message = navParams.get('message')
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    var ref = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid).on('value', snap => {
      if (snap.val().role != 'none') {
        let prompt = this.alertCtrl.create({
          title: 'Congratulations',
          message: "You are " + snap.val().role + " now. Please Login again.",
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
        this.logout();
      }
    });
  }
  logout() {
    firebase.auth().signOut().then((response) => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.setRoot(LoginPage)
    });
  }

}
