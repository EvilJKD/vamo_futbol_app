import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Match } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import {Map, tileLayer, marker, polyline } from 'leaflet';

@Component({
  selector: 'app-matches-detail',
  templateUrl: './matches-detail.page.html',
  styleUrls: ['./matches-detail.page.scss'],
})
export class MatchesDetailPage implements OnInit {

  matchID: string = '';
  matchInfo: any;

  //MAPA
  map: Map;
  marker: any;
  currentPosition: any;

  constructor(private location: Location, private route: ActivatedRoute, private dataService: DataService, private geolocation: Geolocation) { }

  ngOnInit() {
    //Control de inicializacion de mapas
    if (this.map) {
      console.log('Removing')
      this.map.off();
      this.map.remove();
    }


    this.matchID = this.route.snapshot.paramMap.get('id');
    
    this.dataService.getMatchById(this.matchID).subscribe((match) => {
      
      let matchLat, matchLong;

      //Field Info Population
      this.dataService.getFieldById(match.match_field).subscribe((fieldInfo) => {
        const {field_name, latitud, longitud, max_players, status} = fieldInfo;
        matchLat = latitud;
        matchLong = longitud;
        //Localizacion del Marker
        match.match_field= {field_name, latitud, longitud, max_players, status};
      })

      match.match_players.forEach((player, idx) => {
        this.dataService.getUserById(player).subscribe((playerInfo) => {
          const {first_name, last_name, phone_number, picture_url} = playerInfo;
          match.match_players[idx] = {first_name, last_name, phone_number, picture_url};
        })
      })

      this.matchInfo = match;

      //Inicializacion del mapa
      this.geolocation.getCurrentPosition().then(resp => {
        const current = [resp.coords.latitude, resp.coords.longitude];
        this.showMap(current);
        this.placeMarker([matchLat, matchLong], current); 
      });

    });

  }

  backButtonClick(){
    this.location.back();
  }
  
  showMap(currentPosition) {
    this.map = new Map('mapaCancha').setView(currentPosition, 10);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);

  }

  placeMarker(fieldPosition, currentPosition){
    this.marker = marker(fieldPosition).addTo(this.map);
    polyline([fieldPosition, currentPosition]).addTo(this.map);
  }

}
