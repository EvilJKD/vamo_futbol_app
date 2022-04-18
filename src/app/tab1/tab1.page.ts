import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

// PLUGIN
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import {distanceBetweenTwoPoints} from '../helpers/utils'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  currentUser: any;

  matches;

  constructor(private dataService: DataService,
    private geolocation: Geolocation) { }

  async ngOnInit() {
    const {coords:{latitude, longitude}} = await this.geolocation.getCurrentPosition();

    this.dataService.getNearbyFields(latitude, longitude, 50).subscribe(res => {
      const fieldsIds = res.map(field => {
        const id = field.id
        return id;
      })
      
      if(fieldsIds.length == 0){
        console.log('No hay canchas cercanas')
        this.matches = []
        return 
      }
      this.dataService.getMatchesByFields(fieldsIds).subscribe((matches) => {
       this.matches = this.populateMatches(matches, {lat: latitude, long: longitude})
      });
    });

    //Hardcoded pero depende del usuario
    this.dataService.getUserById("LxoTotn3TStaEXDZja2u").subscribe((user) => {
      this.currentUser = user;
    });

  }


  populateMatches(matchesArr, posicion) {
    matchesArr.forEach((match) => {
      //Field Info Population
      this.dataService.getFieldById(match.match_field).subscribe((fieldInfo) => {
        const {field_name, latitud, longitud, max_players, status} = fieldInfo;
        const posicionCancha = {
          lat: latitud, 
          long: longitud
        }
        const distance = `${distanceBetweenTwoPoints(posicion, posicionCancha)} km`

        match.match_field= {field_name, distance, max_players, status};
      })

      match.match_players.forEach((player, idx) => {
        this.dataService.getUserById(player).subscribe((playerInfo) => {
          const {first_name, last_name, phone_number, picture_url} = playerInfo;
          match.match_players[idx] = {first_name, last_name, phone_number, picture_url};
        })
      })
    })

    return matchesArr;
  }

}
