import { Pipe, PipeTransform } from '@angular/core';
import { GeoPoint } from '@angular/fire/firestore';
import * as dayjs from 'dayjs';
import { Match } from '../interfaces/interfaces';
import { DataService } from '../services/data.service';
import {distanceBetweenTwoPoints} from '../helpers/utils'


@Pipe({
  name: 'matchPopulation'
})
export class MatchPopulationPipe implements PipeTransform {

  constructor(private dataService: DataService){}

  transform(matchesArr: [any]): any[] {

    console.log('Received matches', matchesArr);


    if(!matchesArr){
      return [];
    }

    console.log(matchesArr);
    matchesArr.forEach((match) => {
      //Field Info Population
      this.dataService.getFieldById(match.match_field).subscribe((fieldInfo) => {
        const {field_name, latitud, longitud, max_players, status} = fieldInfo;
        match.match_field= {field_name, latitud, longitud, max_players, status};
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
