import { FeedbackPage } from './../../feedback/feedback-page/feedback-page';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular'
import * as firebase from 'firebase'
import { UserHelper } from './../../common/Utilities/user-helper';
import { NavController} from 'ionic-angular';
import { LoginPage } from "../../common/login-page/login-page";


@Component({
    templateUrl: 'engineer-tabs.html'
})
export class EngineerTabs {
     @ViewChild(Nav) nav: Nav;
     cUser: any
  pages: Array<{ title: string, icon: string, component: any }>;
  rootPage: any = CurrentJobsPage;
  constructor(public navCtrl: NavController) {
    this.pages = [
      {title: 'Current Jobs', icon:'logo-buffer', component: CurrentJobsPage},
      {title: 'Feedback', icon: 'ios-paper', component: FeedbackPage}
    ];
    this.cUser = UserHelper.getCurrentUser()
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