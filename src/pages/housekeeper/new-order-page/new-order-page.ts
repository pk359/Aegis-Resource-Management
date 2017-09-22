import { Service } from './../../common/Model/Service';
import { UserHelper } from './../../common/Utilities/user-helper';
import { User } from './../../common/Model/User';
import { PhotoHelper } from './../../common/Utilities/photo-helper';
import { Job } from './../../common/Model/Job';
import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { Camera } from '@ionic-native/camera'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  selector: 'new-order-page',
  templateUrl: 'new-order-page.html',
})
export class NewOrderPage {
  firebaseJobObject: any = {}
  servicePictures: any = []
  serviceName = ''
  color = 'rgba(0, 0, 0, 0.18)'
  progress = 0
  error = ''
  cUser: User
  jobData: Job = new Job();
  services = []
  photoHelper: PhotoHelper
  categories = new Set()
  categoryAndServices = []
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFire,
    public modalCtrl: ModalController, public camera: Camera,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public photoViewer: PhotoViewer, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController) {
    this.cUser = UserHelper.getCurrentUser()

    firebase.database().ref('services').on('value', snap => {
      if (snap.val() != null) {
        //Get list of categoies;
        Object.keys(snap.val()).map(key => {
          this.categories.add(snap.val()[key]['category']);
        })
        //Get Service in array format
        this.services = Object.keys(snap.val()).map(key => {
          return snap.val()[key];
        })
        //Populate services on category basis
        this.categories.forEach(category => {
          var serviceList = this.services.filter((s: Service) => {
            return s.category === category;
          })
          this.categoryAndServices[category] = serviceList;
          console.log(serviceList)
        })
        console.log(this.categories, this.services)
      }
    })
    this.photoHelper = new PhotoHelper(this.cUser.name, this.camera)
  }

  selectService(event, value) {
    var index = this.jobData.serviceList.indexOf(value);
    if (event.checked) {
      this.jobData.serviceList.push(value);
    } else {
      this.jobData.serviceList.splice(index, 1);
    }
  }

  snap() {
    this.photoHelper.snap()
  }

  imageSelected(i) {

    //Add code to show full screen image.
  }
  deleteImage(imageIndex) {
    this.photoHelper.photos.splice(imageIndex, 1);
  }

  placeRequest() {
    this.error = '';
    var noPhoto = false;
    if (this.jobData.room === '' ||
      this.jobData.building === '') {
      this.error = 'All fields are necessary';
    } else if (this.jobData.serviceList.length == 0) {
      this.error = 'Please select at least one service.'
    } else if (this.photoHelper.photos.length == 0) {
      noPhoto = true
    }

    if (this.error == '') {
      if (noPhoto) {
        this.alertCtrl.create({
          title: 'No Photo Attached',
          message: 'Place an order without photo?',
          buttons: [
            {
              text: 'YES',
              handler: () => {
                this.saveRequestToFirebase();
              }
            }, {
              text: 'NO'
            }
          ]
        }).present()
      } else {
        this.saveRequestToFirebase();
      }
    }
  }

  saveRequestToFirebase() {
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: 'crescent',
      content: 'Submiting Request, please wait...'
    });
    loading.present();
    this.photoHelper.uplaod().then(() => {
      // Upload completed successfully, now we can get the download URL
      this.photoHelper.photos.forEach(photo => {
        this.jobData.photosByHousekeeper.push(photo.URL);
      })
      this.jobData.jobCreatorName = this.cUser.name;
      this.jobData.jobCreatorUid = this.cUser.uid;
      this.jobData.setCreationTime(new Date());
      var reqRef = firebase.database().ref('requests/').push()
      this.jobData.key = reqRef.key;
      reqRef.set(this.jobData).then(r => {
        loading.dismiss();
        this.toastCtrl.create({
          message: 'Your order has been placed successfully.',
          duration: 4000,
          position: 'button',
          showCloseButton: true,
          dismissOnPageChange: false
        }).present();
        this.jobData = new Job();
        this.photoHelper = new PhotoHelper(this.cUser.name, this.camera)
      })
    })
  }
  showInFullScreen(imageUrl) {
    this.photoViewer.show(imageUrl)
  }
  onClickService(name: string) {
    this.alertCtrl.create({
      title: 'Remove Service',
      message: 'Are you sure you want to delete ' + name + ' from selected services?',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            const index = this.jobData.serviceList.indexOf(name);
            if (index !== -1) {
              this.jobData.serviceList.splice(index, 1);
            }
          }
        },
        {
          text: 'NO'
        }
      ]
    }).present()
  }
  remove(array, element) {
  }

  //Show alert with all the services under a category
  showAlertWithServices(category: string) {

    let alert = this.alertCtrl.create();
    alert.setTitle(category);

    this.categoryAndServices[category].map(service => {

      var checked = this.jobData.serviceList.indexOf(service.name) > -1;
      alert.addInput({
        type: 'checkbox',
        label: service.name,
        value: service.name,
        checked: checked
      });

    })

    alert.addButton({
      text: 'Okay',
      handler: (data: any) => {

        // if (data.length > 0) {
          //Get the list of data from new array that are not already in the service list
          this.categoryAndServices[category].forEach(service => {

            var indexOfServiceInServiceList = this.jobData.serviceList.indexOf(service.name);
            if (data.indexOf(service.name) > -1 && indexOfServiceInServiceList < 0) {
              this.jobData.serviceList.push(service.name);
            }

            if (data.indexOf(service.name) < 0 && indexOfServiceInServiceList > -1) {
              this.jobData.serviceList.splice(indexOfServiceInServiceList, 1);
            }
          })

          //Add only which are checked. 

          //Remove which are not checked under this category from service list

         
        // }
        console.log(this.jobData.serviceList);
      }
    });

    alert.present();

  }
}

