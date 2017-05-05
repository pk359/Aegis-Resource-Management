import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
@Component({
  selector: 'page-invoice-page',
  templateUrl: 'invoice-page.html',
})
export class InvoicePage {

  jobs: any = []
  priceObject: any = {}
  cost: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.jobs = this.navParams.data.jobs;

    this.jobs.forEach(job => {
      this.priceObject[`${job}`] = 0
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePage');
  }
  calculateTotalPrice() {
    this.cost = 0;
    Object.keys(this.priceObject).forEach(k => {
      this.cost += parseInt(this.priceObject[k]);
    })
    if (isNaN(this.cost)) {
      this.alertCtrl.create({
        title: 'Oops!',
        message: 'One of more Cost value does not seem right.',
        buttons: ['Okay']
      }).present();
    }
  }
  sendInvoiceToClient() {

  }

}
