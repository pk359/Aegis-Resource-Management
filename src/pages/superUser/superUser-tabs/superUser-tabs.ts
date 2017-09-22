
import { ServiceListPage } from './../../headAegis/service-list-page/service-list-page';
import { Historypage } from './../../common/history/history';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular'
import * as firebase from 'firebase'
import { UserHelper } from './../../common/Utilities/user-helper';
import { NavController } from 'ionic-angular';
import { LoginPage } from "../../common/login-page/login-page";

@Component({
  templateUrl: 'superUser-tabs.html'
})
export class SuperUserTabs {

  @ViewChild(Nav) nav: Nav;
  cUser: any
  pages: Array<{ title: string, icon: string, component: any }>;
  rootPage: any = CurrentJobsPage;
  constructor(public navCtrl: NavController) {
    this.pages = [
      { title: 'Current Jobs', icon: 'logo-buffer', component: CurrentJobsPage },
      { title: 'Service List', icon: 'ios-list-box', component: ServiceListPage },
      { title: 'Past Records', icon: 'ios-archive', component: Historypage }
    ];
    this.cUser = UserHelper.getCurrentUser()
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }
  logout() {
    firebase.auth().signOut().then(_ => {
      this.navCtrl.push(LoginPage);
      UserHelper.removeUser();
    })
  }
}
