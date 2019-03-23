import { File, Entry, FileError } from '@ionic-native/file';
import { PlacesProvider } from './../../providers/places/places';
import { Camera } from '@ionic-native/camera';
import { Location } from './../../models/location';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Geolocation } from '@ionic-native/geolocation';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: 25.726297,
    lng: -100.312155
  };
  imageUrl = '';

  locationIsSet = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private placesProvider: PlacesProvider,
    private file: File) {
  }

  onSubmit(form: NgForm){
    this.placesProvider.addPlace(form.value.title, form.value.description,
      this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat: 25.726297,
      lng: -100.312155
    };
    this.imageUrl = '';
    this.locationIsSet = false;
  }

  onOpenMap(){
    const modal = this.modalCtrl.create(SetLocationPage,
      {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data =>{
        if (data){
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onLocate(){
    const loader = this.loadingCtrl.create({
      content: "Getting your location ... "
    });
    loader.present();
    this.geolocation.getCurrentPosition()
    .then(
      location =>{
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
      }
    )
    .catch(
      error =>{
        console.log(error);
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Could not get location ...',
          duration: 2500
        });
        toast.present();
      }
    );
  }

  onTakePhoto(){
    this.camera.getPicture({
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    })
    .then(
      imageData =>{
        // this.webview.convertFileSrc(imageData);
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = Date.now() + '.jpg';
        this.file.moveFile(path, currentName,
          cordova.file.dataDirectory, newFileName)
        .then(
          (data: Entry) =>{
            const win: any = window;
            this.imageUrl = win.Ionic.WebView.convertFileSrc(data.nativeURL);

            // this.camera.cleanup();
            this.file.removeFile(path,currentName);
          }
        )
        .catch(
          (err: FileError)=>{
            console.log(err);

            this.imageUrl = '';
            const toast = this.toastCtrl.create({
              message: 'Could not save image :(',
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          });

        this.imageUrl = this.imageUrl;

      }
    )
    .catch(
      err =>{
        console.log(err);

        const toast = this.toastCtrl.create({
          message: 'Could not save image :(',
          duration: 2500
        });
        toast.present();
      }
    );
  }

}
