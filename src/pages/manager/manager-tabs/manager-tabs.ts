import { Component } from '@angular/core';
import {ManagerCurrentJobsPage} from '../current-jobs-page/current-jobs-page'
import {NewUserRequest} from '../new-user-request/new-user-request'

@Component({
  templateUrl: 'manager-tabs.html'
})
export class ManagerTabs {
  
  tab2Root = ManagerCurrentJobsPage;
  tab3Root = NewUserRequest;
  constructor() {

  }

}
