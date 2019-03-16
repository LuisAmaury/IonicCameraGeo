import { PlacePage } from './../place/place';
import { PlacesProvider } from './../../providers/places/places';
import { Place } from './../../models/place';
import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  addPlacePage = AddPlacePage;
  places: Place[] = [];
  constructor(
    public navCtrl: NavController,
    private placesProvider: PlacesProvider,
    private modalCtrl: ModalController) {

  }

  ionViewWillEnter(){
   this.places = this.placesProvider.loadPlaces();
  }

  onOpenPlace(place: Place, index: number){
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index});
    modal.present();
  }
}
