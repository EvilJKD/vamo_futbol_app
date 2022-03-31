import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Match } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-matches-detail',
  templateUrl: './matches-detail.page.html',
  styleUrls: ['./matches-detail.page.scss'],
})
export class MatchesDetailPage implements OnInit {

  matchID: string = '';
  matchInfo: any;

  constructor(private location: Location, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {

    this.matchID = this.route.snapshot.paramMap.get('id');
    
    this.dataService.getMatchById(this.matchID).subscribe((match) => {
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

      this.matchInfo = match;
    });

    console.log(this.matchInfo);

  }

  backButtonClick(){
    this.location.back();
  }
  

}
