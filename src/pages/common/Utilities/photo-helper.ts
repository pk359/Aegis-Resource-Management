import { CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase'
class Photo {
    image
    name: string = ''
    URL: string
    constructor(image, name) {
        this.image = image
        this.name = name;
    }
}
export class PhotoHelper {

    photos = []
    userName = ''
    camera;
    options: CameraOptions = {};
    constructor(userName, camera) {

        this.camera = camera
        this.userName = userName;
        this.options = {
            quality: 95,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,
            correctOrientation: true,
            targetHeight: 700,
            targetWidth: 700,
            allowEdit: false
        }
    }

    uplaod(callback) {
        var count = 0;
        this.photos.forEach(photo => {
            firebase.storage().ref('images/' + this.userName + '/' + photo.name).putString(photo.image, 'base64').then(snapshot => {
                photo.URL = snapshot.downloadURL
                count += 1
                if (count == this.photos.length) {
                    callback()
                }
            }).catch(e => {
                console.log("error while trying to upload photo!: " + e)
            })
        })
    }


    snap() {
        this.camera.getPicture(this.options).then(data => {
            var photo: Photo = new Photo(data, "" + this.getPhotoName())
            this.photos.push(photo);
        }, (err) => {
            console.log("error: " + err)
        });
    }
    getPhotoName() {
        var date = new Date();
        var newDate = new Date(8 * 60 * 60000 + date.valueOf() + (date.getTimezoneOffset() * 60000));
        var ampm = newDate.getHours() < 12 ? ' AM' : ' PM';
        var strDate = newDate + '';
        return (strDate).substring(0, strDate.indexOf(' GMT')) + ampm + ".jpg"
    }
}