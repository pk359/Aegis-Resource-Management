import { HeadEngineerTabs } from './../../headEngineer/headEngineer-tabs/headEngineer-tabs';
import { TradesPersonTabs } from './../../tradesperson/trades-person-tabs/trades-person-tabs';
import { LoginPage } from './../login-page/login-page';
import { JobDetailsPage } from './../job-details-page/job-details-page';
import { User } from './../Model/User';
import { FCM } from '@ionic-native/fcm';
import { UserHelper } from './../Utilities/user-helper';
import { SuperUserTabs } from './../../superUser/superUser-tabs/superUser-tabs';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HeadAegisTabs } from '../../headAegis/headAegis-tabs/headAegis-tabs'
import { HousekeeperTabs } from '../../housekeeper/housekeeper-tabs/housekeeper-tabs'
import { MessagePage } from '../message-page/message-page'
import { AngularFire } from 'angularfire2'
import { App } from 'ionic-angular';

@Component({
  selector: 'page-ui-decider',
  templateUrl: 'ui-decider.html',
})
export class UIDecider {
  currentUser: User;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire, public fcm: FCM, public appCtrl: App) {
    // this.af.auth.subscribe;
    var cU = UserHelper.getCurrentUser()
    this.currentUser = cU;
    try {
      this.doNotificationStuff();
    } catch (e) {

    }
    if (cU && cU.uid != undefined) {
      if (cU.role == 'headAegis') this.navCtrl.push(HeadAegisTabs)
      else if (cU.role == 'headEngineer') this.navCtrl.push(HeadEngineerTabs)
      else if (cU.role == 'housekeeper') this.navCtrl.push(HousekeeperTabs)
      else if (cU.role == 'tradesperson') this.navCtrl.push(TradesPersonTabs)
      else if (cU.role == 'superUser') this.navCtrl.setRoot(SuperUserTabs)
      else if (cU.role == 'none') this.navCtrl.push(MessagePage, {
        message: 'Please wait for administrator to assign you a role.'
      })
    } else {
      this.navCtrl.resize();
      this.navCtrl.push(LoginPage, {}, caches.delete)
    }
  }
  doNotificationStuff() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        let jobKey = data.key;
        let page = data.page;
        if (page == 'messageboard') {

        } else if (page == 'detail') {
          this.navCtrl.push(JobDetailsPage, {
            key: jobKey
          })
        }
      }
    })

    this.fcm.onTokenRefresh().subscribe(token => {

      this.currentUser.updateToken(token)
    })
    this.fcm.getToken().then(token => {
      this.currentUser.updateToken(token)
    })
    let topics = ['headAegis', 'housekeeper', 'tradesperson','headEngineer']
    topics.forEach(topic => {
      if (topic != this.currentUser.role) {
        this.fcm.unsubscribeFromTopic(topic)
      }
    })
    this.fcm.subscribeToTopic(this.currentUser.role);
  }
}
