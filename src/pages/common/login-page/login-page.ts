import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  activeForm: string = 'login'
  errors: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(email: string, password: string) {
    this.errors = []
    if (password.length < 6) {
      this.errors.push('Password must have more than 5 chars.')
    }
    if (!this.testEmail(email)) {
      this.errors.push("Please enter a valid email.");
    }
  
  }

  signup(name: string, email: string, password: string) {
    this.errors =[]
    name = name.trim();
    if (name.length < 2) {
      this.errors.push('Name must have more than 1 characters.')
    }
    if (password.length < 6) {
      this.errors.push('Password must have more than 5 chars.')
    }
    if (!this.testEmail(email)) {
      this.errors.push("Please enter a valid email.");
    }
    
  }

  forgot(email: string) {
    this.errors =[]
    if (!this.testEmail(email)) {
      this.errors.push("Please enter a valid email.");
    }
  }

  //Validate Email
  testEmail(str: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(str);
  }

  //switch form display 
  showForm(formName: string) {
    switch (formName) {
      case "login":
        this.activeForm = 'login';
          console.log('login clicked')
        break;
      case "forgot":
      console.log('forgot clicked')
       this.activeForm = 'forgot';
        break;
      case "signup":
      console.log('signup clicked')
       this.activeForm = 'signup';
        break;
    }
  }





}
