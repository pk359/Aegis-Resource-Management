import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {NewOrderPage} from '../new-order-page/new-order-page'
import {ClientCurrentJobsPage} from '../client-current-jobs-page/client-current-jobs-page'

@Component({
  templateUrl: 'client-tabs.html',
})
export class ClientTabs {
  
  tab1Root = NewOrderPage;
  tab2Root = ClientCurrentJobsPage;
  constructor() {
  }
}
