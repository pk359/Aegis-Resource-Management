import { Component } from '@angular/core';
import { Platform, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UIDecider } from '../pages/common/ui-decider/ui-decider'
// import {LoginPage} from  '../pages/common/login-page/login-page'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = UIDecider;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, ionicapp: IonicApp) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(function (event) {
      }, 100)
    });
  }
}
