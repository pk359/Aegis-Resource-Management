import { Component } from '@angular/core';
import {TPCurrentJobsPage} from '../tp-current-jobs-page/tp-current-jobs-page'

@Component({
  templateUrl: 'trades-person-tabs.html',
})
export class TradesPersonTabs {

  tab3Root = TPCurrentJobsPage
  constructor() {
  }

}
