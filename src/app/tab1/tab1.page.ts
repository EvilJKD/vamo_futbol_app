import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../services/data.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  currentUser: any;

  matches: Observable<any>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.matches = this.dataService.getMatches();
    //Hardcoded pero depende del usuario
    this.dataService.getUserById("LxoTotn3TStaEXDZja2u").subscribe((user) => {
      this.currentUser = user;
    });
  }
}
