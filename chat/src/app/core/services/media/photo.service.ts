import { Injectable } from '@angular/core';
import { CameraService } from './camera.service';
import { ImageConversionService } from './image-conversion-service';

export interface PhotoCaptureResult {
  formData: FormData;
  preview: string;        // data-URL you can bind to <img [src]="…">
}
export type TakingPictureStatus = 'Off' | 'Pending' | 'Success' | 'Error';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  
  constructor( 
    private camera:  CameraService,
    private converter: ImageConversionService) {}

  async takePicture(): Promise<PhotoCaptureResult> {
    const photo = await this.camera.getPhoto();
    if (!photo?.base64String) {
      throw new Error('No photo captured');
    }
    // 2) Build the data-URL for preview
    const preview = `data:image/jpeg;base64,${photo.base64String}`;

    // Convert base64 to Blob
    const imageBlob = this.converter.base64ToBlob(photo.base64String);
    const formData = this.converter.toFormData(imageBlob);
    return { formData, preview }
  }
}
