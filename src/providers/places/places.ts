import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Location } from './../../models/location';
import { Place } from './../../models/place';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var cordova: any;

@Injectable()
export class PlacesProvider {
  private places: Place[] = [];
  index: number;

  constructor(
    private storage: Storage,
    private file: File
  ){

  }

  addPlace(
    title: string,
    description: string,
    location: Location,
    imageUrl: string,
    ){
      const place = new Place(title, description, location, imageUrl);
      this.places.push(place);
      this.storage.set('places',this.places)
        .then()
        .catch((err)=>{
          this.places.splice(this.places.indexOf(place),1);
        })
    }

    loadPlaces(){
      return this.places.slice();
    }

    fetchPlaces(){
      return this.storage.get('palces')
        .then((places: Place[])=>{
          this.places = places != null ? places : [];
          return this.places.slice();
        })
        .catch(err =>{
          console.log(err);
        })
    }

    deletePlace(index: number){
      const place = this.places[index];
      this.places.splice(index,1);
      this.storage.set('places',this.places)
        .then( ()=>{
          this.removeFile(place);
        })
        .catch(err =>{
          console.log(err);
        })
    }

    private removeFile(place: Place){
      const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
      this.file.removeFile(cordova.file.dataDirectory, currentName)
        .then( () =>{
          console.log("Removed file");
        })
        .catch( () =>{
          console.log("Error while removing file");
          this.addPlace(place.title, place.description,
            place.location, place.imageUrl);
        });
    }

}
