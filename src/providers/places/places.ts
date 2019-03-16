import { Location } from './../../models/location';
import { Place } from './../../models/place';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PlacesProvider {
  private places: Place[] = [];
  index: number;

  addPlace(
    title: string,
    description: string,
    location: Location,
    imageUrl: string,
    ){
      const place = new Place(title, description, location, imageUrl);
      this.places.push(place);
    }

    loadPlaces(){
      return this.places.slice();
    }

    deletePlace(index: number){
      this.places.splice(index,1);
    }

}
