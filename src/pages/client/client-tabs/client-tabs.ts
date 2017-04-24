import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {NewOrderPage} from '../new-order-page/new-order-page'

@Component({
  templateUrl: 'client-tabs.html',
})
export class ClientTabs {
  
  tab3Root = NewOrderPage;
  constructor() {
  }

}
