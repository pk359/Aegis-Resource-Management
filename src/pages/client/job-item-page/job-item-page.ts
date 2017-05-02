import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'job-item-page.html',
})
export class JobItemPage {

  jobs: any = []
  selectedJobs = []
  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidEnter() {
    var nData = this.navParams.data.jobs;
    console.log(nData + 'from jobitem')
    // this.selectedJobs = this.navParams.data.selectedJobs
    if (nData instanceof Array) {
      nData.forEach(val => {
        this.jobs.push(val)
      })
    }
    else if (nData instanceof Object) {
      Object.keys(nData).forEach(k => {
        nData[k].forEach(v => {
          this.jobs.push(v)
        })
      })
    }
  }

  appendJob(job) {
    var index = this.selectedJobs.indexOf(job);
    if (index > -1) {
      this.selectedJobs.splice(index, 1)
    } else {
      this.selectedJobs.push(job)
    }
  }
  done() {
    this.viewCtrl.dismiss(this.selectedJobs)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad JobItemPage');
  }

}
