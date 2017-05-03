import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2'
import firebase from 'firebase'
import { LoginPage } from '../../common/login-page/login-page'
import { JobDetailsPage} from '../../common/job-details-page/job-details-page'
import {ManagerJobProgressPage} from '../job-progress-page/job-progress-page'


@Component({
  templateUrl: 'current-jobs-page.html',
})
export class ManagerCurrentJobsPage {

  cUser: any
  currentJobs: any = []
  ref: any
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    // console.log(this.currentJobs)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManagerCurrentJobsPage');
  }

  ionViewCanEnter(){

    this.ref = firebase.database().ref('request').orderByChild('completed').equalTo(false);
    this.ref.on('value', snap => {
      this.currentJobs = []
      var tempData = {}
      Object.keys(snap.val()).forEach(key => {
        tempData = snap.val()[key];
        tempData['key'] = key;
        this.currentJobs.push(tempData);
      })
      console.log(this.currentJobs)
    })
  }
  ionViewCanLeave(){
    this.ref = null;
  }

  setApprove(key) {
    firebase.database().ref('request/' + key + '/progress/').update({
      aegisApproved: true
    }).then(() => {
      this.showToast('Job is approved, please assign a tradesperson now');
    })
  }

  assignTP(key) {
    var ref = firebase.database().ref('users/');
    var tp = []
    ref.orderByChild('role').equalTo('tradesperson').once('value', snap => {
      tp = snap.val();
    }).then(() => {
      let alert = this.alertCtrl.create({
        title: 'Select Tradesperson',
        message: 'You can assign multiple people to one job.',
        enableBackdropDismiss: false
      });

      Object.keys(tp).forEach(key => {
        alert.addInput({
          type: 'checkbox',
          label: tp[key].name,
          //'{ "name":"John", "age":30, "city":"New York"}'
          value: `{"tpId": "${key}", "tpName": "${tp[key].name}"}` ,
          checked: false
        });
      })
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Okay',
        handler: data => {
          console.log(data)
          var tpData = []
          data.forEach(d=>{
            tpData.push({tpId: JSON.parse(d).tpId, tpName: JSON.parse(d).tpName})
          })
          firebase.database().ref('request/' + key + '/progress/').update({
            tpAssigned: tpData
          }).then(() => {
            // data.forEach(d=>{
            //   firebase.database().ref('tradesperson/'+d+'/'+key).set({
            //     completed: false
            //   })
            // })
            this.showToast('Workers have been assigned successfully.');
          })
        }
      });
      alert.present();
    });
  }

  showDetailsPage(key) {
    this.navCtrl.push(JobDetailsPage,{
      jobKey: key
    });
  }
  showProgresPage(key) {
   this.navCtrl.push(ManagerJobProgressPage,{
      jobKey: key
    });
  }

  showToast(message) {
    this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      showCloseButton: true,
      dismissOnPageChange: false
    }).present();
  }
  logout() {
    this.currentJobs = null;
    this.af.auth.logout().then(() => {
      window.localStorage.removeItem('userdetails')
      this.navCtrl.push(LoginPage);
    });
  }

}
