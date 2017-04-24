import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login-page/login-page';

import { ManagerTabs } from '../../manager/manager-tabs/manager-tabs'
import { ClientTabs } from '../../client/client-tabs/client-tabs'
import { TradesPersonTabs } from '../../tradesperson/trades-person-tabs/trades-person-tabs'
import { MessagePage } from '../message-page/message-page'
import { AngularFire } from 'angularfire2'


import firebase from 'firebase';
@Component({
  selector: 'page-ui-decider',
  templateUrl: 'ui-decider.html',
})
export class UIDecider {

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        var email = user.email;
        var uid = user.uid;
        var role = ""
        firebase.database().ref('users/' + uid).once('value').then((snapshot) => {
          role = snapshot.val().role;
          var cUser = {
            email: email,
            uid: uid,
            name: snapshot.val().name,
            role: role
          };
          window.localStorage.setItem('userdetails', JSON.stringify(cUser))
          switch (role) {
            case 'manager':
              navCtrl.push(ManagerTabs)
              break;
            case 'client':
              navCtrl.push(ClientTabs)
              break;
            case 'tradesperson':
              navCtrl.push(TradesPersonTabs)
              break;
            default:
              navCtrl.push(MessagePage, {
                message: "Please wait for the administrator to assign you a role."
              })
          }
        });
      } else {
        navCtrl.push(LoginPage)
      }
    });
  }

  ionViewDidLoad() {
    console.log('uidecided loaded')
  }

  logout() {
    firebase.auth().signOut().then((response) => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }

}
