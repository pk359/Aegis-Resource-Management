import { Service } from './../../common/Model/Service';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  templateUrl: 'new-service-page.html',
})
export class NewServicePage {
  firebaseJobObject: any = {}
  servicePictures: any = []
  color = 'rgba(0, 0, 0, 0.18)'
  progress = 0
  error = ''
  cUser: any
  serviceName: string = ''
  categories: string[] = []
  category: string = ''
  newCategoryName: string = ''
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFire,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public photoViewer: PhotoViewer, public alertCtrl: AlertController) {

    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));

    firebase.database().ref('services').on('value', snap => {
      this.categories = [];
      if (snap.val() != null) {
        Object.keys(snap.val()).forEach(key => {
          let service = new Service();
          Object.assign(service, snap.val()[key]);
          if (service.category in this.categories == false) {
            this.categories.push(service.category)
          }
        })
      }
    })

  }

  save() {
    if (this.serviceName == '') {
      this.error = 'Must have name!'
      return;
    }
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: 'crescent',
      content: 'Saving new Service to database'
    });
    loading.present();
    var service = new Service();
    service.name = this.serviceName;
    service.category = this.category;
    let ref = firebase.database().ref('services/').push();
    service.key = ref.key;
    ref.set(service).then(r => {
      loading.dismiss();
      this.toastCtrl.create({
        message: 'Save Successfully.',
        duration: 2000,
        position: 'bottom',
        showCloseButton: false,
        dismissOnPageChange: true
      }).present();
      this.navCtrl.pop();
    }).catch(r => {
      console.log(r);
    })
  }
  addCategory() {
    if (this.newCategoryName == '') {
      this.toastCtrl.create({
        message: 'Please enter category name you want to add!',
        duration: 3
      }).present()
      return;
    }
    this.categories.push(this.newCategoryName);
    this.toastCtrl.create({
      message: 'Category added to list!',
      duration: 3
    }).present()
  }
}

