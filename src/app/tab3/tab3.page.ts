import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/interfaces';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  currentUser:any;

  constructor(private dataService:DataService) {}

  ngOnInit(){
    //Hardcoded pero depende del usuario
    this.dataService.getUserById("LxoTotn3TStaEXDZja2u").subscribe((user) => {
      this.currentUser = user;
    });
  }
}
