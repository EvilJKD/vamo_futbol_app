import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DomSanitizer } from '@angular/platform-browser'
import { Capacitor } from '@capacitor/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FbstorageService } from 'src/app/services/fbstorage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

//Plugins
import { File } from '@awesome-cordova-plugins/file/ngx';

@Component({
  selector: 'app-profilesetup',
  templateUrl: './profilesetup.page.html',
  styleUrls: ['./profilesetup.page.scss'],
})
export class ProfilesetupPage implements OnInit {


  currentUser: any = '';
  userImg: any = '';
  imgNativePath: any;
  base64Image: any;

  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  }

  galleryOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    encodingType: this.camera.EncodingType.JPEG,
    destinationType: this.camera.DestinationType.DATA_URL
  }

  constructor(
    private location: Location,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private auth: AngularFireAuth,
    private camera: Camera,
    private storageService: FbstorageService,
    private dataService: DataService,
    private file: File,
    private domSanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {

    this.auth.currentUser.then(user => {
      this.dataService.getUserById(user.uid).subscribe((user) => {
        this.currentUser = user;
      });
    })

  }

  //Componentes IONIC
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Selecciona una foto',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camara',
        icon: 'camera-outline',
        id: 'camera-button',
        handler: () => {
          this.openCamera();
        }
      }, {
        text: 'Galería',
        icon: 'folder-outline',
        id: 'gallery-button',
        handler: () => {
          this.openGallery();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();


  }

  //Metodos Camara y Foto
  openCamera() {
    this.camera.getPicture(this.cameraOptions).then(async  imgData => {
      this.base64Image = 'data:image/jpeg;charset=utf-8;base64,' + imgData;


      
      console.log('imgData', imgData);
      this.imgNativePath = URL.createObjectURL(this.storageService.base64ToImage(this.base64Image));
      this.imgNativePath = this.domSanitizer.bypassSecurityTrustUrl(this.imgNativePath);
      this.userImg = this.imgNativePath;

      console.log('native path', this.imgNativePath);
    }, err => {
      console.log('err', err);
    })
  }


  openGallery() {
    this.camera.getPicture(this.galleryOptions).then(imgData => {

      this.base64Image = 'data:image/jpeg;charset=utf-8;base64,' + imgData;

      imgData = Capacitor.convertFileSrc(imgData);

      
      
      console.log('imgData', imgData);
      this.imgNativePath = URL.createObjectURL(this.storageService.base64ToImage(this.base64Image));
      this.imgNativePath = this.domSanitizer.bypassSecurityTrustUrl(this.imgNativePath);
      this.userImg = this.imgNativePath;

      console.log('native path', this.imgNativePath);


    }, err => {
      console.log('err', err);
    })
  }

  async confirmAndUpload() {
    const blob = await this.storageService.base64ToImage(this.base64Image);
    
    const task = this.storageService.uploadToFirebase(`profilePictures/${this.currentUser.id}.jpg`, blob);

    console.log('url', (await task).ref.getDownloadURL());
  }

  backButtonClick() {
    this.location.back();
  }

}
