import { Component } from '@angular/core';
import {NewUserRequest} from '../new-user-request/new-user-request'

@Component({
  templateUrl: 'manager-tabs.html'
})
export class ManagerTabs {
  
  tab3Root = NewUserRequest;
  constructor() {

  }

}
