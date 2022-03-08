import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  backButtonClick(){
    this.location.back();
  }

}
