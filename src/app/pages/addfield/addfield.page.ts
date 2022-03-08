import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addfield',
  templateUrl: './addfield.page.html',
  styleUrls: ['./addfield.page.scss'],
})
export class AddfieldPage implements OnInit {

  constructor(private location: Location) { }

  

  ngOnInit() {
  }

  backButtonClick(){
    this.location.back();
  }
}
