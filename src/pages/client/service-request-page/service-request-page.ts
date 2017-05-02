import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import { LoginPage } from '../../common/login-page/login-page'
import { NewOrderPage } from '../new-order-page/new-order-page'
@Component({

   templateUrl: 'service-request-page.html',
})
export class ServiceRequestPage {

  cUser:any = {}
  serviceOffered:any ={}
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public af: AngularFire) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    this.serviceOffered = [
      {name: 'Painting', background: 'painting.png'},
      {name: 'Marble Polishing of floors',  background:'polishing.png'},
      {name: 'Spray Varnishing of Furnitures and Varnishing', background: 'varnishing.png'},
      {name: 'Resurfacing', background: 'resurfacing.png'},
      {name: 'Grouting', background: 'grouting.png'}]
  }

  goToNewOrderPage(serviceName){
    this.navCtrl.push(NewOrderPage, {
      serviceName: serviceName
    })
  }

  logout() {
    this.af.auth.logout().then(() => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }

}