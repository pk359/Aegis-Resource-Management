import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../../common/login-page/login-page'

@Component({
  templateUrl: 'new-order-page.html',
})
export class NewOrderPage {

  cUser: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
  }


  logout() {
    firebase.auth().signOut().then((response) => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.setRoot(LoginPage)
    });
  }

}