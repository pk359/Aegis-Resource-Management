import { UserHelper } from './../pages/common/Utilities/user-helper';
import { User } from './../pages/common/Model/User';
import { Job } from './../pages/common/Model/Job';
import { Component } from '@angular/core';
import { Platform, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UIDecider } from '../pages/common/ui-decider/ui-decider'
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

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      platform.registerBackButtonAction(function (event) {
      }, 100)
    });
    if (UserHelper.getCurrentUser().role in ['headAegis', 'housekeeper', 'headEngineer', 'headHousekeeper']) {
      this.backgroundMode.enable();
      setInterval(() => {

        //get jobs from firebase 
        firebase.database().ref('requests').once('value', d => {
          if (d.val()) {
            const o = d.val();
            let count = 0;
            Object.keys(o).forEach(key => {
              const job = new Job();
              Object.assign(job, o[key]);
              if (job.isCompleted() && !job.isCompletionApproved()) {
                count++;

              }
            })
            //TEST
            if (count > 0) {
              const msg = count + ' jobs pending for approval';
              this.sendNotification(msg);
            }
          }
        })
      }, 1000 * 60 * 60)
    }
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
