import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { Component } from '@angular/core';
import { FeedbackPage} from './../../feedback/feedback-page/feedback-page';

@Component({
  templateUrl: 'trades-person-tabs.html',
})
export class TradesPersonTabs {

  tab2Root = CurrentJobsPage
  tab3Root = FeedbackPage;
  constructor() {
  }

}
