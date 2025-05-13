import { Injectable } from "@angular/core";
import { Camera } from "@capacitor/camera";

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  async requestCameraAndGallery(): Promise<{
    camera: 'granted' | 'denied',
    photos: 'granted' | 'denied'
  }> {
    const status = await Camera.requestPermissions();
    return {
      camera: status.camera === 'granted' ? 'granted' : 'denied',
      photos: status.photos === 'granted' ? 'granted' : 'denied'
    };
  }
}