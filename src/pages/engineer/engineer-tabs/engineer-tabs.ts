import { Component } from '@angular/core';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';

@Component({
    templateUrl: 'engineer-tabs.html'
})
export class EngineerTabs {
    tab2Root = CurrentJobsPage;
    constructor() {
    }
}