import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../../common/login-page/login-page'

@Component({
  templateUrl: 'tp-jobs.html',
})
export class TPJobs {

  cUser:any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
  }


   logout() {
       window.localStorage.removeItem('userdetails')
    firebase.auth().signOut().then((response) => {
      this.navCtrl.push(LoginPage);
    });
   }

}
