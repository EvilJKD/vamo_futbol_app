import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-field-details',
  templateUrl: './field-details.page.html',
  styleUrls: ['./field-details.page.scss'],
})
export class FieldDetailsPage implements OnInit {

  currentUser: any;

  fieldID: any;
  fieldInfo: any;

  matches: any;
  today: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dataService: DataService,
    public modalController: ModalController,
    private auth: AngularFireAuth,
    
  ) { }

  ngOnInit() {
    this.fieldID = this.route.snapshot.paramMap.get('id');
    console.log('ID', this.fieldID);

    this.dataService.getFieldById(this.fieldID).subscribe(data => {
      this.fieldInfo = data;
    })

    this.today = dayjs(new Date());

    this.auth.currentUser.then(user => {

      this.dataService.getUserById(user.uid).subscribe((user) => {
        this.currentUser = user;

        this.dataService.getMatchesByFields(this.currentUser.owned_fields).subscribe(matches => {

          this.matches = matches.filter(match => {
            const matchDate = dayjs(match.match_date, 'YYYY-MM-DDTHH:mm:ss:SSSZ')
            return matchDate.diff(this.today) > 0 && match.match_field == this.fieldID;
          })

          // this.matches = this.matches.map( match => {
          //   match.match_field = new Date(match.match_date);

          //   return match;
          // })

        });

      });
    })
    

  }


  //Matches
  getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date(), hour) {
    const dayOfWeek = ["sun","mon","tues","wed","thurs","fri","sat"]
                      .indexOf(dayName);
    if (dayOfWeek < 0) return;

    const posibleHour = hour.split('-')[0].split('h')[0];
    const posibleMinute = hour.split('-')[0].split('h')[1];

    refDate.setHours(Number(posibleHour),Number(posibleMinute),0,0);
    refDate.setDate(refDate.getDate() + +!!excludeToday + 
                    (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
    return refDate;
}

  async createNewMatch(day, hour){

    console.log(day.value, hour.value);
    
    const refDate = this.getNextDayOfTheWeek(day.value, true, new Date(), hour.value);
    const dateString = dayjs(refDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    console.log('RefDate', refDate);

    const newMatch = {
      match_date: dateString,
      match_field: this.fieldID,
      match_players: [],
      status: 'S'
    }


    const matchId = await this.dataService.createNewMatch(newMatch);

    console.log('MatchId', matchId);

  }


  //Modal

  dismiss(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  //Navigation
  backButtonClick(){
    this.location.back();
  }
}
