import { FeedbackPage } from './../../feedback/feedback-page/feedback-page';
import { ServiceListPage } from './../service-list-page/service-list-page';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component, ViewChild } from '@angular/core';
import { NewUserRequest } from '../new-user-request/new-user-request'
import { Nav } from 'ionic-angular'
import * as firebase from 'firebase'
import { UserHelper } from './../../common/Utilities/user-helper';
import { NavController} from 'ionic-angular';
import { LoginPage } from "../../common/login-page/login-page";


@Component({
  templateUrl: 'manager-tabs.html'
})
export class ManagerTabs {

  @ViewChild(Nav) nav: Nav;
  pages: Array<{ title: string, icon: string, component: any }>;
  rootPage: any = CurrentJobsPage;
  constructor(public navCtrl: NavController) {
    this.pages = [
      {title: 'Current Jobs', icon:'logo-buffer', component: CurrentJobsPage},
      {title: 'Service List', icon: 'contacts', component: ServiceListPage},
      {title: 'New User Request', icon: 'contacts', component: NewUserRequest },
      {title: 'Feedback', icon: 'ios-paper', component: FeedbackPage}
    ];
  }
  openPage(page){
    this.nav.setRoot(page.component);
  }
  logout() {
    firebase.auth().signOut().then(_=>{
      this.navCtrl.push(LoginPage);
      UserHelper.removeUser();
    })
  }
}
