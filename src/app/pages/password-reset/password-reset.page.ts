import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  constructor(private location: Location, public authService: AuthService,
    private router: Router,
    public toastController: ToastController) { }

  ngOnInit() {
  }


  passwordRecovery(email){

    console.log(email.value);

    this.authService.PasswordRecover(email.value).then(res => {


      this.presentToast('COMPLETED', 'Password recovery email has been sent.', "checkmark-circle-outline", "darkgreen");

      setTimeout(() => {
        this.router.navigate(['']);
      }, 1500);

    }).catch(err => {
      this.presentToast('ERROR', err.message, "close-circle-outline", "danger");
    });


  }
  backButtonClick(){
    this.location.back();
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

}
