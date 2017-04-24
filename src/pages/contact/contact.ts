import { Component } from '@angular/core';
import { NavController,AlertController, ActionSheetController } from 'ionic-angular';
import {AngularFire, FirebaseListObservable} from 'angularfire2'
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

 songs: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,public actionSheetCtrl:ActionSheetController, af: AngularFire) {
    this.songs = af.database.list('/songs');
  }

  addSong(){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter the song name",
      inputs: [{
        name: 'title',
        placeholder: 'Title'
      },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.push({
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
  showOptions(songId, songTitle){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },
        {
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancle clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId: string){
    this.songs.remove(songId);
  }

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data=> {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}

