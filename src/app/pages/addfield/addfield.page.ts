import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

//Ionic 
import { PickerController, PickerColumn, PickerColumnOption } from '@ionic/angular';

//Plugins
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { DataService } from 'src/app/services/data.service';
import { FbstorageService } from 'src/app/services/fbstorage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-addfield',
  templateUrl: './addfield.page.html',
  styleUrls: ['./addfield.page.scss'],
})
export class AddfieldPage implements OnInit {

  currentUser: any;

  currentPosition: any = {
    latitude: null,
    longitude: null
  };

  posiblesDias: PickerColumnOption[] = [
    {text: 'Lunes', value: 'mon'},
    {text: 'Martes', value: 'tues'},
    {text: 'Miércoles', value: 'wed'},
    {text: 'Jueves', value: 'thurs'},
    {text: 'Viernes', value: 'fri'},
    {text: 'Sábado', value: 'sat'},
    {text: 'Domingo', value: 'sun'},
  ]

  posiblesHoras: PickerColumnOption[] = [
    {text:'16h00-17h20', value: '16h00-17h20'},
    {text:'17h30-18h50', value: '17h30-18h50'},
    {text:'19h00-20h20', value: '19h00-20h20'},
    {text:'20h30-21h50', value: '20h30-21h50'},
    {text:'22h00-22h20', value: '22h00-22h20'},
  ]

  dias: PickerColumn = {
    name: 'Days',
    options: this.posiblesDias
  }
  horas: PickerColumn = {
    name: 'Hours',
    options: this.posiblesHoras
  }

  //SubirArchivo
  file: any;

  constructor(
    private location: Location,
    private pickerController: PickerController,
    private dataService: DataService,
    private storage: FbstorageService,
    private auth: AngularFireAuth,
    private geolocation: Geolocation) { }

  horarios: any[] = [];

  ngOnInit() {
    
    this.auth.currentUser.then(user => {
      this.dataService.getUserById(user.uid).subscribe((user) => {
        this.currentUser = user;
      });
    })
  }

  //Picker Functions
  async  openPicker() {
    const picker = await this.pickerController.create({
      columns: [this.dias, this.horas],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(`Got Value ${JSON.stringify(value)}`);
            this.horarios.push(value);
          },
        },
      ],
    });

    await picker.present();
  }

  removeFromHorarios(idx){
    this.horarios.splice(idx);
  }

  // Cargar posicion
  
  async loadGeolocation(){
    const { coords: { latitude, longitude } } = await this.geolocation.getCurrentPosition();

    this.currentPosition = {
      latitude, 
      longitude
    }
  }

  //Update location
  updateLocation(attr, value){
    value = value.detail.value;
    if (attr == "lat"){
      this.currentPosition['latitude'] = value;
    } else if (attr == "long"){
      this.currentPosition['longitude'] = value;
    }
  }
  

  // Crear cancha
  async createNewField(name, address, players, ruc, file){
    
    console.log('file', this.file, 'value', this.file.name)

    const newField = {
      field_name: name.value,
      latitude: Number(this.currentPosition.latitude),
      longitud: Number(this.currentPosition.longitude),
      max_players: Number(players.value),
      status: 'A',
      availability: this.horarios,
      address: address.value,
      ruc: ruc.value,
    }
    
    const objField = await this.dataService.createNewField(newField);

    await this.dataService.updateUserById(this.currentUser.id, {
      owned_fields: [...this.currentUser.owned_fields, objField]
    })
    

    const uploadTask = this.storage.uploadFile(this.file, objField);

    uploadTask.then(async res => {
      console.log('Completed');

      const updateField = {
        permit_url: await res.ref.getDownloadURL()
      }

      await this.dataService.updateFieldById(objField, updateField);

      this.backButtonClick();
    })

  }

  onChangeFile(event){
    this.file = (event.target as HTMLInputElement).files[0];
  }

  backButtonClick(){
    this.location.back();
  }
}
