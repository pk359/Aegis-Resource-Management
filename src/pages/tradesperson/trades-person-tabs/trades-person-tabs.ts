import { Component } from '@angular/core';
import { TPJobs } from '../tp-jobs/tp-jobs'

@Component({
  templateUrl: 'trades-person-tabs.html',
})
export class TradesPersonTabs {

  tab3Root = TPJobs
  constructor() {
  }

}
