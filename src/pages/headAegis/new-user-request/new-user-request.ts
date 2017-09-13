import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'

@Component({
  templateUrl: 'new-user-request.html',
})
export class NewUserRequest {
  users: any = []
  cUser: any
  ref: any
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));

  }
  ionViewCanEnter() {

    this.users = this.af.database.list('users/', {
      query: {
        orderByChild: 'role',
        equalTo: 'none'
      }
    })
  }
  ionViewWillLeave() {
    this.users = null;
  }

  userSelected(key, name) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Assign Role to ' + name);
    alert.addInput(
      {
        type: 'radio',
        label: 'Housekeeper',
        value: 'housekeeper',
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
      label: 'HeadAegis',
      value: 'headAegis',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'HeadEngineer',
      value: 'headEngineer',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Superuser',
      value: 'superUser',
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



}
