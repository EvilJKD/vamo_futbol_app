import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profilesetup',
  templateUrl: './profilesetup.page.html',
  styleUrls: ['./profilesetup.page.scss'],
})
export class ProfilesetupPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  backButtonClick(){
    this.location.back();
  }

}
