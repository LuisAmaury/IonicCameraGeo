import { PlacesProvider } from './../../providers/places/places';
import { Place } from './../../models/place';
import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  index: number;
  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private placesProvider: PlacesProvider) {
      this.place = this.navParams.get('place');
      this.index = this.navParams.get('index');
  }

  onLeave(){
    this.viewCtrl.dismiss();
  }

  onDelete(){
    this.placesProvider.deletePlace(this.index);
    this.onLeave;
  }

}
