import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { ServiceListPage } from './../../manager/service-list-page/service-list-page';
import { NewOrderPage } from './../../client/new-order-page/new-order-page';
import { TPCurrentJobsPage } from './../../tradesperson/tp-current-jobs-page/tp-current-jobs-page';
import { NewUserRequest } from './../../manager/new-user-request/new-user-request';
import { Component } from '@angular/core';
@Component({
    templateUrl: 'superUser-tabs.html'
})
export class SuperUserTabs {

    currentJobTab = CurrentJobsPage;
    NewUserTab = NewUserRequest;
    TPCurrentJobTab = TPCurrentJobsPage
    newOrderTab = NewOrderPage
    serviceListPage = ServiceListPage;
    constructor() {

    }
}