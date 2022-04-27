import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  constructor(public authService: AuthService, 
    public router: Router) { }

  ngOnInit() {
  }

  logIn(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then(res => {
        if(this.authService.isEmailVerified){
          this.router.navigate(['home','home', 'partidos'])
        } else {
          window.alert('No se ha verificado el email');
          return false;
        }
      }).catch(err => {
        window.alert(err.message);
      })
  }

}
