import { Injectable } from '@angular/core';
import { AngularFireStorage} from '@angular/fire/compat/storage';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import * as firebase from 'firebase/app';
import 'firebase/storage'
@Injectable({
  providedIn: 'root'
})
export class FbstorageService {

  constructor(
    private storage: AngularFireStorage,
    private file: File
  ) { }
  
  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }


  uploadToFirebase(filePath,blob) {
    console.log("uploadToFirebase");
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, blob);


    return task;
  }


  async uploadFile(f, id){

    const uploadTask = this.storage.upload(
      `files/${new Date().getTime()}_${id}`,
      f
    );
 
      return uploadTask;
  }


}
