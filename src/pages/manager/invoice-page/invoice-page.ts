import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
@Component({
  selector: 'page-invoice-page',
  templateUrl: 'invoice-page.html',
})
export class InvoicePage {

  jobs: any = []
  priceObject: any = {}
  cost: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private emailComposer: EmailComposer) {
    this.jobs = this.navParams.data.jobs;
    this.jobs.forEach(job => {
      this.priceObject[`${job}`] = 0
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePage');
  }

  sendInvoiceToClient() {
    this.calculateTotalPrice();

    if (!isNaN(this.cost)) {
      var body = `<div style="background: #82cbff; border: 1px solid black">`;
      Object.keys(this.priceObject).forEach(k => {
        body += `${k} : $ ${parseInt(this.priceObject[k])} <br>`
      })
      body += `</div>---------------------------<br>
               Total Cost: $ ${this.cost}<br>
               ----------------------------`
      let email = {
        to: 'arni9495@gmail.com',
        subject: 'Invoice for order ' + this.navParams.data.jobTitle,
        body: body,
        isHtml: true
      }
      this.emailComposer.open(email);
    }
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

}
