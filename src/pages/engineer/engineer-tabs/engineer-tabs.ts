import { Component } from '@angular/core';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { FeedbackPage} from './../../feedback/feedback-page/feedback-page';

@Component({
    templateUrl: 'engineer-tabs.html'
})
export class EngineerTabs {
    tab2Root = CurrentJobsPage;
    tab3Root = FeedbackPage;
    constructor() {
    }
}