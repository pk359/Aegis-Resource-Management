import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component } from '@angular/core';
import { NewUserRequest } from '../new-user-request/new-user-request'

@Component({
  templateUrl: 'manager-tabs.html'
})
export class ManagerTabs {

  tab2Root = CurrentJobsPage;
  tab3Root = NewUserRequest;
  constructor() {
  }

}
