import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(private location: Location,
    private authService: AuthService, 
    private router:Router) { }

  ngOnInit() {
  }


  //Metodo para registrarse
  signUp(name, id, email, password){  
    this.authService.RegisterUser(name.value, id.value, email.value, password.value)
    .then(res => {

      this.authService.SendVerificationMail();
      this.router.navigate(['verify-email'])
    }).catch(err => {
      window.alert(err.message);
    })
  }

  backButtonClick(){
    this.location.back();
  }
}
