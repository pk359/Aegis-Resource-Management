import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login-page/login-page';

import { ManagerTabs } from '../../manager/manager-tabs/manager-tabs'
import { ClientTabs } from '../../client/client-tabs/client-tabs'
import { TradesPersonTabs } from '../../tradesperson/trades-person-tabs/trades-person-tabs'
import { MessagePage } from '../message-page/message-page'
import { AngularFire } from 'angularfire2'
@Component({
  selector: 'page-ui-decider',
  templateUrl: 'ui-decider.html',
})
export class UIDecider {

  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) { }

  ionViewDidLoad() {
    console.log('uidecided loaded')
  }
  //Will always fire
  ionViewDidEnter() {
    // var views = this.navCtrl.getViews();
    // views.forEach(function (k) {
    //   console.log(k.component.name)
    // });
    var cU = JSON.parse(window.localStorage.getItem('userdetails'))
    if (cU) {
      if (cU.role == 'manager') this.navCtrl.push(ManagerTabs)
      else if (cU.role == 'client') this.navCtrl.push(ClientTabs)
      else if (cU.role == 'tradesperson') this.navCtrl.push(TradesPersonTabs)
      else if (cU.role == 'none') this.navCtrl.push(MessagePage)
    } else {
      this.navCtrl.push(LoginPage)
    }
  }

  logout() {
    this.af.auth.logout().then(function () {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }
}
