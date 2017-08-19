import { Component } from '@angular/core';
import { UserHelper } from './../../common/Utilities/user-helper';
import { User } from './../../common/Model/User';
import { NavController, NavParams, ToastController, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { AngularFire } from 'angularfire2'
import firebase from 'firebase'
import { Feedback } from './../../common/Model/Feedback';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({

  templateUrl: 'feedback-page.html'
})
export class FeedbackPage {

  feedbackData: Feedback = new Feedback();
  cUser: User

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {

    this.cUser = UserHelper.getCurrentUser()
  }

  submitFeedback() {
    if (this.feedbackData.description === '') {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Please fill in the description',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          }
        ]
      }); actionSheet.present();
    } else {
      this.saveRequestToFirebase();
      this.feedbackData.description = null
    }
  }


  saveRequestToFirebase() {
    let loading = this.loadingCtrl.create({
      showBackdrop: false,
      spinner: 'crescent',
      content: 'Submiting Request, please wait...'
    });
    loading.present();

    var reqRef = firebase.database().ref('feedback/').push()
    this.feedbackData.key = reqRef.key;
    reqRef.set(this.feedbackData).then(r => {
      loading.dismiss();
      this.toastCtrl.create({
        message: 'Your feedback has been submitted successfully.',
        duration: 4000,
        position: 'button',
        showCloseButton: true,
        dismissOnPageChange: false
      }).present();

    })
  }
}














