import { Job } from './../pages/common/Model/Job';
import { Component } from '@angular/core';
import { Platform, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UIDecider } from '../pages/common/ui-decider/ui-decider'
// import {LoginPage} from  '../pages/common/login-page/login-page'
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import * as firebase from 'firebase'
@Component({


  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = UIDecider;
  count = 0;
  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode, private localNotifications: LocalNotifications, ionicapp: IonicApp) {
    this.backgroundMode.enable();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(function (event) {
      }, 100)
    });
    // setInterval(()=>{
    //   firebase.database().ref('')
    // },1000*60*60)

    setInterval(() => {
      //get jobs from firebase 
      firebase.database().ref('requests').once('value', d => {
        console.log('h', d.val())
        if (d.val()) {
          const o = d.val();
          let count = 0;
          Object.keys(o).forEach(key => {
            const job = new Job();
            Object.assign(job, o[key]);
            if (job.isCompleted() && !job.isCompletionApproved()) {
              count++;
              console.log('approved')
            } else {
              console.log('un approved')
            }
          })
          if (count > 0) {
            const msg = count + ' jobs pending for approval';
            this.sendNotification(msg);
          }
        } else {
          console.log('NO JOB!')
        }
      })
    }, 5000)
  }
  sendNotification(msg: string) {
    this.localNotifications.schedule({
      id: 1,
      text: msg,
      sound: this.platform.is('android') ? 'file://sound.mp3' : 'file://beep.caf',
      // data: { secret: key }
    });
    console.log(msg)
  }
}
