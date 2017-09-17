import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UserHelper } from '../Utilities/user-helper';
import * as firebase from 'firebase'
import { User } from '../Model/User';
@Component({
  selector: 'page-create-new-user',
  templateUrl: 'create-new-user.html',
})
export class CreateNewUserPage {
  name: string
  email: string
  selectedRole: string
  cUser: any
  roles = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.cUser = UserHelper.getCurrentUser();
    firebase.database().ref('roleassignment/' + this.cUser['role']).once('value', snap => {
      this.roles = Object.keys(snap.val()).map(key => { return { key: key, value: snap.val()[key] } })
      console.log(this.roles)
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNewUserPage');
  }
  createUser() {
    if (this.email && this.selectedRole && this.name) {
      firebase.auth().createUserWithEmailAndPassword(this.email, 'password123456').then(res => {
        let loading = this.loadingCtrl.create({
          content: 'creating user, please wait...',
          showBackdrop: false,
          duration: 2000
        })
        loading.present();
        firebase.auth().sendPasswordResetEmail(this.email).then(res => {
          alert('Ask user to check their email for password reset link');
        })
        //Create user in our database
        var user: User = new User();
        user.name = this.name;
        user.role = this.selectedRole;
        user.email = this.email;
        user.uid = res.uid;
        firebase.database().ref('users/' + res.uid).set(user).then(r => {
          this.name = ''
          this.email = ''
          this.selectedRole = ''
        })
      })
        .catch(err => {
          alert(err['message'])
        })
    } else {
      alert('please fill all the fields');
    }
  }

}
