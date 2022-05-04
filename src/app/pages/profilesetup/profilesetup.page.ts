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
import { LoadingController } from '@ionic/angular';

//Plugins
import { File } from '@awesome-cordova-plugins/file/ngx';

@Component({
  selector: 'app-profilesetup',
  templateUrl: './profilesetup.page.html',
  styleUrls: ['./profilesetup.page.scss'],
})
export class ProfilesetupPage implements OnInit {

  //Profilepictures
  avatars = [
    'https://firebasestorage.googleapis.com/v0/b/vamo-futbol-app.appspot.com/o/avatars%2FAvatar1.jpg?alt=media&token=2c1c270e-34d8-451c-93ce-a4193836f2a3',
    'https://firebasestorage.googleapis.com/v0/b/vamo-futbol-app.appspot.com/o/avatars%2FAvatar2.jpg?alt=media&token=93472e8c-b3d5-4e5f-b37b-116cf480105d',
    'https://firebasestorage.googleapis.com/v0/b/vamo-futbol-app.appspot.com/o/avatars%2FAvatar3.jpg?alt=media&token=c3cfdff9-44f1-4ec4-b902-0569502acce8',
    'https://firebasestorage.googleapis.com/v0/b/vamo-futbol-app.appspot.com/o/avatars%2FAvatar4.jpg?alt=media&token=f3a5cdc3-efa2-4a25-bb86-54dcc464c537'
  ]


  //ion component
  loading: any;

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
    public loadingController: LoadingController,
    private auth: AngularFireAuth,
    private camera: Camera,
    private storageService: FbstorageService,
    private dataService: DataService,
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

  // ---------- Componentes IONIC

  //ActionSheet
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
      }]
    });
    await actionSheet.present();


  }


  //ION LOADING
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissLoading(){
    await this.loading.dismiss();
  }


  // ---------- PLUGINS 
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


  //---------- ACTUALIZACION DE INFORMACION
  //UPDATE del Profile_url
  async confirmAndUpload() {
    this.presentLoading();

    const blob = await this.storageService.base64ToImage(this.base64Image);
    
    const task = this.storageService.uploadToFirebase(`profilePictures/${this.currentUser.id}.jpg`, blob);

    const downloadUrl = await (await task).ref.getDownloadURL();
    
    this.dataService.updateUserById(this.currentUser.id, {
      picture_url: downloadUrl 
    }).then(() => {
      this.dismissLoading();
      this.router.navigate(['home','home','partidos'])
    })
  }


  //---------RUTEO
  backButtonClick() {
    this.location.back();
  }

}
