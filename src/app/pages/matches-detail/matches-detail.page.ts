import { AfterViewInit, Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Match } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import {Map, tileLayer, marker, polyline } from 'leaflet';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-matches-detail',
  templateUrl: './matches-detail.page.html',
  styleUrls: ['./matches-detail.page.scss'],

})
export class MatchesDetailPage implements OnInit {

  matchID: string = '';
  matchInfo: any;

  fecha: string;


  currentUser: any;
  isRegistered: boolean;

  //MAPA
  map: Map;
  marker: any;
  currentPosition: any;

  private subscription: Subscription;
  
  public dateNow = new Date();
  public dDay;
  //public dDay = new Date('May 20, 2022, 00:00:00');
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;
  valueDate: string;
  


  private getTimeDifference () {
      this.timeDifference = this.dDay.getTime() - new  Date().getTime();
      this.allocateTimeUnits(this.timeDifference);
  }

private allocateTimeUnits (timeDifference) {
      this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
      this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
      this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
      this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}


  constructor(
    private location: Location, 
    private route: ActivatedRoute, 
    public alertController: AlertController,
    private dataService: DataService, 
    private geolocation: Geolocation,
    private auth: AngularFireAuth) { }

  async ngOnInit() {
    this.subscription = interval(1000)
    .subscribe(x => { this.getTimeDifference(); });

    //User
    const user = await this.auth.currentUser;
    this.dataService.getUserById(user.uid).subscribe((user) => {
      this.currentUser = user;

    });
    

    //Control de inicializacion de mapas
    if (this.map) {
      this.map.off();
      this.map.remove();
    }


    this.matchID = this.route.snapshot.paramMap.get('id');
    
    await this.getMatchInfo();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
 }

   async getMatchInfo(){
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

      match.match_players.forEach(async (player, idx) => {
        await this.dataService.getUserById(player).subscribe((playerInfo) => {
          const {first_name, last_name, phone_number, picture_url, id} = playerInfo;
          match.match_players[idx] = {first_name, last_name, phone_number, picture_url, id};
        })
      })

      this.matchInfo = match;

      console.log(this.matchInfo);
      if (this.matchInfo.match_players.find(player => {
        return player == this.currentUser.id
      })){
        this.isRegistered = true;
      } else {
        this.isRegistered = false;
      }

      this.dDay = new Date(this.matchInfo.match_date);
      

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
    
    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    this.map = new Map('mapaCancha').setView(currentPosition, 10);
    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);

  }

  placeMarker(fieldPosition, currentPosition){
    this.marker = marker(fieldPosition).addTo(this.map);
    polyline([fieldPosition, currentPosition]).addTo(this.map);
  }

  //IONIC COMPONENTS

  async presentConfirmationReservation() {
    const alert = await this.alertController.create({
      header: 'REGISTRATION',
      message: 'Presiona el boton para confirmar tu ingreso a este partido',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: () => {
            this.registrarse();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentConfirmationCancelation() {
    const alert = await this.alertController.create({
      header: 'REGISTRATION',
      message: 'Presiona el boton para confirmar tu salida a este partido',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }, {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: () => {
            this.salirPartido();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  //Metodos para los componentes

  registrarse(){
    const max_players = this.matchInfo.match_field.max_players;
    let currentPlayers = this.matchInfo.match_players.map(player => {
      return player.id;
    });
    
    if(currentPlayers.length >= max_players){
      this.presentAlert('Este partido ya esta lleno. Intenta registrarte en algún otro.')
      return;
    }

    currentPlayers.push(this.currentUser.id);

    console.log('Modified current players', currentPlayers);
    this.dataService.updateMatchById(this.matchID, {
      match_players: [...currentPlayers]
    })

  }

  salirPartido(){
    let currentPlayers = this.matchInfo.match_players.map(player => {
      return player.id;
    });
    
    if(!currentPlayers.includes(this.currentUser.id)){
      this.presentAlert('No te encuentras registrado en este partido.')
      return;
    }

    currentPlayers = currentPlayers.filter(player => {
      return player != this.currentUser.id;
    })

    console.log('Modified current players', currentPlayers);
    this.dataService.updateMatchById(this.matchID, {
      match_players: [...currentPlayers]
    })

  }

  

}
