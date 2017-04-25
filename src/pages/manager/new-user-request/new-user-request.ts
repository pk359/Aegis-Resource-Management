import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../../common/login-page/login-page'

@Component({
  selector: 'page-new-user-request',
  templateUrl: 'new-user-request.html',
})
export class NewUserRequest {
  users: FirebaseListObservable<any>;
  cUser: any
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    this.users = af.database.list('users/', {
      query: {
        orderByChild: 'role',
        equalTo: 'none'
      }
    })
  }

  userSelected(key, name) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Assign Role to ' + name);
    alert.addInput(
      {
        type: 'radio',
        label: 'Client',
        value: 'client',
        checked: true
      });
    alert.addInput({
      type: 'radio',
      label: 'Tradesperson',
      value: 'tradesperson',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Manager',
      value: 'manager',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        firebase.database().ref('users/' + key + '/role').set(data)
      }
    });
    alert.present();

  }

  logout() {
    this.af.auth.logout().then(() => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }

}
