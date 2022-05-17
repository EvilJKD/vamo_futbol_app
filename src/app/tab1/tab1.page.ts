import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';

// PLUGIN
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { distanceBetweenTwoPoints } from '../helpers/utils'

import 'dayjs'
import * as dayjs from 'dayjs';
import { ModalController } from '@ionic/angular';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  currentUser: any;
  rangeOfDates: any[];
  matches;
  today: any;
  filteredMatches: any;
  
  selectedDate;

  activeState = 'Draft';

  states = [
    'Draft',
    'Planned',
    'Started',
    'Suspended',
    'Ended',
  ]

  setStateAsActive(state) {

    console.log('state', state)
    this.activeState = state;
  }

  activeDate = 'Draft';

  // states = [
  //   'Draft',
  //   'Planned',
  //   'Started',
  //   'Suspended',
  //   'Ended',
  // ]

  changeDatetimePicker(date){
    const cDate = date.value.split('T')[0]
    const dateParts = cDate.split('-')
    this.changeDateScroll(dateParts[2], dateParts[1], dateParts[0]);

    this.dismissModal();
  }

  changeDateScroll(day, month, year){

    this.filteredMatches = null;

    this.setDayAsActive(`${day}`);

    this.filterDates(`${year}-${month}-${day}`)
  }

  setDayAsActive(dia) {

    const fecha = this.rangeOfDates.find(date => {
      return date.day == dia;
    })

    this.activeDate = dia;
  }


  constructor(
    private dataService: DataService,
    private geolocation: Geolocation,
    private modalController: ModalController) { }

  async ngOnInit() {
    //Fecha Minima para el picker
    this.today = dayjs().format('YYYY-MM-DD');

	//Rango de fechas para seleccionar
	const today = new Date();
	const afterOneWeek = new Date();
	afterOneWeek.setDate(afterOneWeek.getDate()+7);
	this.rangeOfDates = this.getRangeOfDates(today, afterOneWeek);


    const { coords: { latitude, longitude } } = await this.geolocation.getCurrentPosition();

    this.dataService.getNearbyFields(latitude, longitude, 5).subscribe(res => {
      const fieldsIds = res.map(field => {
        const id = field.id
        return id;
      })

      if (fieldsIds.length == 0) {
        console.log('No hay canchas cercanas')
        this.matches = []
        return
      }
      this.dataService.getMatchesByFields(fieldsIds).subscribe((matches) => {
        this.matches = this.populateMatches(matches, { lat: latitude, long: longitude })

        this.filterDates(this.today)
        this.setDayAsActive(this.today.split('-')[2])

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
        const { field_name, latitud, longitud, max_players, status } = fieldInfo;
        const posicionCancha = {
          lat: latitud,
          long: longitud
        }
        const distance = `${distanceBetweenTwoPoints(posicion, posicionCancha)} km`

        match.match_field = { field_name, distance, max_players, status };
      })

      match.match_players.forEach((player, idx) => {
        this.dataService.getUserById(player).subscribe((playerInfo) => {
          const { first_name, last_name, phone_number, picture_url } = playerInfo;
          match.match_players[idx] = { first_name, last_name, phone_number, picture_url };
        })
      })
    })

    return matchesArr;
  }


  getRangeOfDates(startDate, endDate) {
    let dates = []
	let weekdays = {
		0: 'Dom.', 
		1: 'Lun.', 
		2: 'Mart.', 
		3: 'Miérc.',
		4: 'Juev.', 
		5: 'Vier.', 
		6: 'Sáb.'
	}

    const theDate = startDate
    while (theDate < endDate) {
      dates = [...dates, 
		{
			day: theDate.getDate(),
			daySt: weekdays[theDate.getDay()],
			month: theDate.getMonth()+1,
			year: theDate.getFullYear()
		}]
      theDate.setDate(theDate.getDate() + 1)
    }

    return dates

  }

  filterDates(date){
    const currentDate = dayjs(date);

    this.filteredMatches = this.matches.filter(x => {
      const matchDate = dayjs(x.match_date);

      return matchDate.isSame(currentDate, "day");
    })
  }


  

  // Modal
  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
