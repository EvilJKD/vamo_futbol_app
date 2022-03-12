import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-matches-detail',
  templateUrl: './matches-detail.page.html',
  styleUrls: ['./matches-detail.page.scss'],
})
export class MatchesDetailPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  backButtonClick(){
    this.location.back();
  }
  

}
