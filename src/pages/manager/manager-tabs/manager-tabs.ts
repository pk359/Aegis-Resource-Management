import { FeedbackPage } from './../../feedback/feedback-page/feedback-page';
import { ServiceListPage } from './../service-list-page/service-list-page';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component } from '@angular/core';
import { NewUserRequest } from '../new-user-request/new-user-request'

@Component({
  templateUrl: 'manager-tabs.html'
})
export class ManagerTabs {

  tab1Root = CurrentJobsPage;
  tab2Root = NewUserRequest;
  tab3Root = ServiceListPage;
  tab4Root = FeedbackPage;
  constructor() {
  }

}
