import { Injectable } from "@angular/core";
import { PermissionsService } from "./permission.service";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";

@Injectable({ providedIn: 'root' })
export class CameraService {
  constructor(private perms: PermissionsService) {}

  async getPhoto(): Promise<Photo | null> {
    const perm = await this.perms.requestCameraAndGallery();
    if (perm.camera !== 'granted' && perm.photos !== 'granted') {
      return null;
    }
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      webUseInput: true,
      resultType: CameraResultType.Base64, // Ensures the result is returned as Base64
      source: CameraSource.Prompt, // Gives the user the choice to take a photo or pick one
      promptLabelPhoto: 'Choose from library', // Label for the "Choose from library" option
      promptLabelPicture: 'Take a photo', // Label for the "Take a photo" option
      promptLabelCancel: 'Cancel', // Label for the "Cancel" option
    });
  }
}
