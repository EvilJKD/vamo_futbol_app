import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsernameValidator } from '../validators/username.validator';
import { PhoneValidator } from '../validators/phone.validator';
import { PasswordValidator } from '../validators/password.validator';
import { CountryPhone } from './country-phone.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

const validarCedula = (cedula: string) => {
  // Preguntamos si la cedula consta de 10 digitos
  if (cedula.length === 10) {

    // Obtenemos el digito de la region que sonlos dos primeros digitos
    const digitoRegion = cedula.substring(0, 2);

    // Pregunto si la region existe ecuador se divide en 24 regiones
    if (digitoRegion >= String(1) && digitoRegion <= String(24)) {

      // Extraigo el ultimo digito
      const ultimoDigito = Number(cedula.substring(9, 10));

      // Agrupo todos los pares y los sumo
      const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));

      // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
      let numeroUno: any = cedula.substring(0, 1);
      numeroUno = (numeroUno * 2);
      if (numeroUno > 9) {
        numeroUno = (numeroUno - 9);
      }

      let numeroTres: any = cedula.substring(2, 3);
      numeroTres = (numeroTres * 2);
      if (numeroTres > 9) {
        numeroTres = (numeroTres - 9);
      }

      let numeroCinco: any = cedula.substring(4, 5);
      numeroCinco = (numeroCinco * 2);
      if (numeroCinco > 9) {
        numeroCinco = (numeroCinco - 9);
      }

      let numeroSiete: any = cedula.substring(6, 7);
      numeroSiete = (numeroSiete * 2);
      if (numeroSiete > 9) {
        numeroSiete = (numeroSiete - 9);
      }

      let numeroNueve: any = cedula.substring(8, 9);
      numeroNueve = (numeroNueve * 2);
      if (numeroNueve > 9) {
        numeroNueve = (numeroNueve - 9);
      }

      const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

      // Suma total
      const sumaTotal = (pares + impares);

      // extraemos el primero digito
      const primerDigitoSuma = String(sumaTotal).substring(0, 1);

      // Obtenemos la decena inmediata
      const decena = (Number(primerDigitoSuma) + 1) * 10;

      // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
      let digitoValidador = decena - sumaTotal;

      // Si el digito validador es = a 10 toma el valor de 0
      if (digitoValidador === 10) {
        digitoValidador = 0;
      }

      // Validamos que el digito validador sea igual al de la cedula
      if (digitoValidador === ultimoDigito) {
        return true;
      } else {
        return false;
      }

    } else {
      // imprimimos en consola si la region no pertenece
      return false;
    }
  } else {
    // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
    return false;
  }

}

const CedulaValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = validarCedula(`${control.value}`);

    return !valid ? { digits: { value: control.value } } : null;
  }
} 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;

  countries: Array<CountryPhone>;
  genders: Array<string>;

  constructor(private location: Location,
    private authService: AuthService,
    public formBuilder: FormBuilder, 
    private router:Router) { }


  ngOnInit() {
    //  We just use a few random countries, however, you can use the countries you need by just adding them to this list.
    // also you can use a library to get all the countries from the world.
    this.countries = [
      new CountryPhone('UY', 'Uruguay'),
      new CountryPhone('US', 'United States'),
      new CountryPhone('BR', 'Brasil')
    ];

    this.genders = [
      "Male",
      "Female"
    ];

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      id: new FormControl('', Validators.compose([
        Validators.required,
        CedulaValidator()
      ])),
      gender: new FormControl(this.genders[0], Validators.required),
      country_phone: this.country_phone_group,
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Ingrese su nombre.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Ingrese su email.' },
      { type: 'pattern', message: 'Por favor, ingrese un email valido.' }
    ],
    'id': [
      { type: 'required', message: 'Ingrese su cedula de identidad.' },
      { type: 'digits', message: 'Ingrese cedula de identidad valida.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'The phone is incorrect for the selected country.' }
    ],
    'password': [
      { type: 'required', message: 'Ingrese su contraseña.' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 5 caracteres.' },
      { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Ingrese la contraseña de confirmación.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Las constraseñas no coinciden.' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  onSubmit(values){
    console.log(values);
    this.router.navigate(["/user"]);
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
