import { Injectable } from "@angular/core";
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';



@Injectable({
  providedIn: 'root'
})

export class MediaService {
  constructor(){}

  async requestCameraPermissions() {
    const permissionStatus = await Camera.requestPermissions();
    return permissionStatus;
  }


  async takePicture() {
    if (!this.requestCameraPermissions()) {
      return;
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      webUseInput: true,
      resultType: CameraResultType.Base64,
      promptLabelPhoto:"Please upload a photo of yourself"
    });

    console.log(image);
  }

  onTakePicture() {
    this.takePicture();
  }
}
