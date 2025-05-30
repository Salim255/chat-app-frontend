import { Injectable } from "@angular/core";
import { PermissionsService } from "./permission.service";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

enum ReasonString {
  WebPlatform = 'web-platform',
  PermissionDenied = 'permission-denied',
  Error =  'error',
}
export type CameraResult =
  | { success: true; photo: Photo }
  | {
      success: false;
      reason: ReasonString;
    };

@Injectable({ providedIn: 'root' })
export class CameraService {
  constructor(private perms: PermissionsService) {}

  async getPhoto(): Promise<CameraResult> {
    try {
      if (Capacitor.getPlatform() === 'web') {
        return { success: false, reason: ReasonString.WebPlatform };
      }
      const perm = await this.perms.requestCameraAndGallery();
      if (perm.camera !== 'granted' && perm.photos !== 'granted') {
        return  { success: false, reason: ReasonString.PermissionDenied };
      }
      const photo =  await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        webUseInput: true,
        resultType: CameraResultType.Base64, // Ensures the result is returned as Base64
        source: CameraSource.Prompt, // Gives the user the choice to take a photo or pick one
        promptLabelPhoto: 'Choose from library', // Label for the "Choose from library" option
        promptLabelPicture: 'Take a photo', // Label for the "Take a photo" option
        promptLabelCancel: 'Cancel', // Label for the "Cancel" option
      });
      return { success: true, photo }
    } catch (error) {

      return { success: false, reason: ReasonString.Error }
    }
  }
}
