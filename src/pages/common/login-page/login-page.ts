import { Component } from '@angular/core';
import firebase from 'firebase';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, AngularFireAuth, AuthProviders, AuthMethods } from 'angularfire2'

@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  activeForm: string = 'login'
  errors: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    
  }
  ionViewDidLoad() {
     console.log('ionViewDidLoad LoginPage');
     
  }

  login(email: string, password: string) {
    this.errors = []
    this.af.auth.login({
      email, password
    }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((response) => {
        this.navCtrl.pop();
      }).catch((error) => {
        var errorCode = error['code'];
        var errorMessage = error['message'];
        if (errorCode === 'auth/wrong-password') {
          this.errors.push('wrong password');
        } else {
          this.errors.push(errorMessage)
        }
      });
  }

  signup(name: string, email: string, password: string) {
    this.errors = []
    name = name.trim();
    if (name.length < 2) {
      this.errors.push('Name must have more than 1 characters.')
    }
    if (password.length < 6) {
      this.errors.push('Password must have more than 5 chars.')
    }

    if (this.errors.length == 0) {

      this.af.auth.createUser({
        email, password
      })
        .then((response) => {
          firebase.database().ref('users/'+ response.uid).set({
            name: name,
            email: email,
            role: 'none'
          }).then((response) => {
            console.log(response);
          }).catch((error) => {
            console.log(error)
          })
          // console.log('signup success')
          this.navCtrl.pop();
        }).catch((error) => {
          var errorMessage = error['message'];
          this.errors.push(errorMessage)
        });
    }

  }

  forgot(email: string) {
    this.errors = []

    //https://aegis-test-cc70c.firebaseio.com
    firebase.auth().sendPasswordResetEmail(email)
      .then((response) => {
        alert('Check your email for reset link.')
      }).catch((error) => {
        var errorMessage = error['message'];
        this.errors.push(errorMessage)
      });
  }

  //switch form display 
  showForm(formName: string) {
    switch (formName) {
      case "login":
        this.activeForm = 'login';
        // console.log('login clicked')
        break;
      case "forgot":
        // console.log('forgot clicked')
        this.activeForm = 'forgot';
        break;
      case "signup":
        // console.log('signup clicked')
        this.activeForm = 'signup';
        break;
    }
  }
}
