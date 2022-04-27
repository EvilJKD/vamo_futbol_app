import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  constructor(private location: Location, public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }


  passwordRecovery(email){
    this.authService.PasswordRecover(email.value).then(res => {

      window.alert('Mensaje Enviado - Redireccionando');

      setTimeout(() => {
        this.router.navigate(['']);
      }, 1500);

    }).catch(err => {
      window.alert('Error al enviar, intente de nuevo')
    });


  }
  backButtonClick(){
    this.location.back();
  }

}
