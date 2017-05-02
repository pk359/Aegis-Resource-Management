import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {ServiceRequestPage} from '../service-request-page/service-request-page'
import {ClientCurrentJobsPage} from '../client-current-jobs-page/client-current-jobs-page'

@Component({
  templateUrl: 'client-tabs.html',
})
export class ClientTabs {
  
  tab1Root = ServiceRequestPage;
  tab2Root = ClientCurrentJobsPage;
  constructor() {
  }
}
