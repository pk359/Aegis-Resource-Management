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
  jobs: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    firebase.database().ref().child('jobs/').once('value',function(k){
      console.log(k);
    })
    
  }

  logout() {
    this.af.auth.logout().then(() => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }

}
