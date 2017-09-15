import { NewServicePage } from './../new-service-page/new-service-page';
import { Service } from './../../common/Model/Service';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'service-list-page',
  templateUrl: 'service-list-page.html',
})
export class ServiceListPage {
  firebaseJobObject: any = {}
  servicePictures: any = []
  color = 'rgba(0, 0, 0, 0.18)'
  progress = 0
  error = ''
  cUser: any
  categories = []
  services = []
  categoryAndServices = {}
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFire,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public photoViewer: PhotoViewer, public alertCtrl: AlertController,
    public toastController: ToastController) {

    this.cUser = JSON.parse(window.localStorage.getItem('userdetails'));
    firebase.database().ref('services').on('value', snap => {
      if (snap.val() != null) {
        //Get list of categoies;
        this.categories = Object.keys(snap.val()).map(key=>{
          return snap.val()[key]['category'];
        })
        //Get Service in array format
        this.services = Object.keys(snap.val()).map(key=>{
          return snap.val()[key];
        })
        //Populate services on category basis
        this.categories.forEach(category=>{
          var serviceList = this.services.filter((s:Service)=>{
            return s.category === category;
          })
          this.categoryAndServices[category] = serviceList;
          console.log(serviceList)
        })
        console.log(this.categories, this.services)
      }
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
            firebase.database().ref('services/' + service.key).remove().then(a => {
              this.toastCtrl.create({
                message: service.name + ' has been removed!',
                duration: 1050
              }).present()
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
  // getCategories(){
  //   const categories = new Set();
  //   this.services.forEach( (s:Service) =>{
  //     categories.add(s)
  //   });
  //   return categories;
  // }
  getServicesForCategory(category:string){
    return this.services.filter((s:Service)=>{
      return s.category ===category
    })
  }
}