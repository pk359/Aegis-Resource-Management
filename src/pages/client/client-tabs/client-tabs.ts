import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component } from '@angular/core';
import { NewOrderPage } from '../new-order-page/new-order-page'

@Component({
  templateUrl: 'client-tabs.html',
})
export class ClientTabs {

  tab1Root = NewOrderPage;
  tab2Root = CurrentJobsPage;
  constructor() {
  }
}
