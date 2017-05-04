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

  ionViewCanEnter() {
    this.navParams.data.jobs.forEach(j=>{
      this.jobs.push(j)
    })
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

}
