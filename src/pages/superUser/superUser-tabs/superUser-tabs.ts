import { ManagerJobProgressPage } from './../../manager/job-progress-page/job-progress-page';
import { ServiceListPage } from './../../manager/service-list-page/service-list-page';
import { ClientCurrentJobsPage } from './../../client/client-current-jobs-page/client-current-jobs-page';
import { NewOrderPage } from './../../client/new-order-page/new-order-page';
import { TPCurrentJobsPage } from './../../tradesperson/tp-current-jobs-page/tp-current-jobs-page';
import { NewUserRequest } from './../../manager/new-user-request/new-user-request';
import { ManagerCurrentJobsPage } from './../../manager/current-jobs-page/current-jobs-page';
import { Component } from '@angular/core';
@Component({
    templateUrl: 'superUser-tabs.html'
})
export class SuperUserTabs {

    currentJobTab = ManagerCurrentJobsPage;
    NewUserTab = NewUserRequest;
    TPCurrentJobTab = TPCurrentJobsPage
    newOrderTab = NewOrderPage
    clientCurrentJobsTab = ClientCurrentJobsPage
    serviceListPage = ServiceListPage;
    constructor() {

    }
}