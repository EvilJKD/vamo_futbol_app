import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.page.html',
  styleUrls: ['./fields.page.scss'],
})
export class FieldsPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  backButtonClick(){
    this.location.back();
  }

}
