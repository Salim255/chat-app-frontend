import { Injectable } from '@angular/core';
import { CameraResult, CameraService } from './camera.service';
import { ImageConversionService } from './image-conversion-service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

export interface PhotoCaptureResult {
  formData: FormData;
  preview: string;        // data-URL you can bind to <img [src]="…">
}
export type TakingPictureStatus = 'Off' | 'Pending' | 'Success' | 'Error';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {

  constructor (
    private toastService: ToastService,
    private camera: CameraService,
    private converter: ImageConversionService) {}

  async takePicture(): Promise<PhotoCaptureResult> {
    const result: CameraResult = await this.camera.getPhoto();
    if (!result?.success) {
     throw new Error(`${result.reason}`)
    }
    // 2) Build the data-URL for preview
    if (!result.photo.base64String) {
      throw new Error(`Unknown Error `)
    }
    const preview = `data:image/jpeg;base64,${result.photo.base64String}`;

    // Convert base64 to Blob
    const imageBlob = this.converter.base64ToBlob(result.photo.base64String);
    const formData = this.converter.toFormData(imageBlob);
    return { formData, preview }
  }

  webPlatformFileUpload(file: File): PhotoCaptureResult | null {
    if (!file.type.startsWith('image/')) {
      this.toastService.showError('Only image files are allowed.');
      return null;
    }
    const preview  = URL.createObjectURL(file);
    const formData = this.converter.toFormData(file);
    return { formData, preview }
  }
}
