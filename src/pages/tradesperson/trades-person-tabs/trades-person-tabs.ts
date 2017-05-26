import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'trades-person-tabs.html',
})
export class TradesPersonTabs {

  tab3Root = CurrentJobsPage
  constructor() {
  }

}
