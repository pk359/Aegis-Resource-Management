import { NewServicePage } from './../new-service-page/new-service-page';
import { Service } from './../../common/Model/Service';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'service-list-page.html',
})
export class ServiceListPage {
  firebaseJobObject: any = {}
  servicePictures: any = []
  color = 'rgba(0, 0, 0, 0.18)'
  progress = 0
  error = ''
  cUser: any
  services = []
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFire,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public photoViewer: PhotoViewer, public alertCtrl: AlertController) {

    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    firebase.database().ref('services/').on('value', data => {
      this.services = []
      if (data.val()) {
        Object.keys(data.val()).forEach(key => {
          this.services.push(data.val()[key]);
        })
      }
      console.log(data)
    })
  }
  onClickCreateService() {
    this.navCtrl.push(NewServicePage, {}, caches.has)
  }
  onClickService(service: Service) {
    let alert = this.alertCtrl.create({
      title: 'Delete ' + service.name,
      subTitle: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'yes',
          handler: () => {
            firebase.database().ref('services/').orderByChild('name').equalTo("" + service.name).ref.remove(a => {

            })
          }
        },
        {
          text: 'No'
        }
      ]
    })
    alert.present()
  }
}