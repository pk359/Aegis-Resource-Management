import { LoginPage } from './../../common/login-page/login-page';
import { CurrentJobsPage } from './../../common/current-jobs-page/current-jobs-page';
import { UserHelper } from './../../common/Utilities/user-helper';
import { User } from './../../common/Model/User';
import { PhotoHelper } from './../../common/Utilities/photo-helper';
import { Job } from './../../common/Model/Job';
import { Component } from '@angular/core';
import { NavController, ActionSheetController, NavParams, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera'
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
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
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public af: AngularFire,
    public modalCtrl: ModalController, public camera: Camera,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController,
    public photoViewer: PhotoViewer, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController) {

    this.cUser = UserHelper.getCurrentUser()
    firebase.database().ref('services/').on('value', data => {
      this.services = []
      if (data.val()) {
        Object.keys(data.val()).forEach(key => {
          this.services.push(data.val()[key]);
        })
      }
      console.log(data)
    })
    this.photoHelper = new PhotoHelper(this.cUser.name, this.camera)
  }

  showJobs() {
    var alert = this.alertCtrl.create({
      title: 'All services...',
      message: 'Select at least one service',
      enableBackdropDismiss: false,
      buttons: [{
        text: 'Done',
        handler: name => {
          name.forEach(element => {
            this.jobData.serviceList.push(element);

          });
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    })
    this.services.forEach(service => {
      alert.addInput({
        type: 'checkbox',
        label: service.name,
        value: service.name,
        // checked
      })
    })
    alert.present();
  }

  snap() {
    this.photoHelper.snap()
  }

  imageSelected(i) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose your action',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.photoHelper.photos.splice(i, 1);
          }
        }, {
          text: 'Fullscreen',
          handler: () => {
            console.log('dont have method')
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
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
        this.jobData.photosByClient.push(photo.URL);
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
      }).catch(r => {
        console.log(r);
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

  logout() {
    this.af.auth.logout().then(() => {
      UserHelper.removeUser();
      this.navCtrl.push(LoginPage);
    });
  }
}

