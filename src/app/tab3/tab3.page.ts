import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/interfaces';
import { DataService } from '../services/data.service';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  currentUser:any;

  constructor(private dataService:DataService,
    private auth: AngularFireAuth,
    private authService: AuthService,
    public toastController: ToastController,
    private router: Router) {}

  ngOnInit(){

    this.auth.currentUser.then(user => {
      this.dataService.getUserById(user.uid).subscribe((user) => {
        this.currentUser = user;
      });
    })


  }


  logOut(){
    this.authService.SignOut().then( res => {
      setTimeout(() => {
        this.router.navigate(['']);
      }, 1500);
    }
    ).catch( err => {
      this.presentToast('ERROR', err.message, "close-circle-outline", "danger");
    });
  }



  //Mostrat Toast
  async presentToast(ttl, msg, icon, color) {
    const toast = await this.toastController.create({
      header: ttl, 
      message: msg,
      icon: icon,
      color: color,
      duration: 2000
    });
    toast.present();
  }

  public Show: boolean = false;
  public Edit: boolean = true;

  toggleEdit() {
      this.Show = !this.Show;
      this.Edit = !this.Edit;
}
}
