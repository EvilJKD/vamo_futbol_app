import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.page.html',
  styleUrls: ['./fields.page.scss'],
})
export class FieldsPage implements OnInit {

  currentUser: any;
  fields = [];

  constructor(
    private location: Location,
    private auth: AngularFireAuth,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.auth.currentUser.then(user => {
      this.dataService.getUserById(user.uid).subscribe((user) => {
        this.currentUser = user;

        for(let fieldId of this.currentUser.owned_fields){
          this.dataService.getFieldById(fieldId).subscribe(data => {
            
            console.log('Data', data)
            
            this.fields.push(data)
          })
        }

      });
    })
  }

  backButtonClick(){
    this.location.back();
  }

}
