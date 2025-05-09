import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
 } from '@capacitor/camera';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { AccountService } from 'src/app/features/account/services/account.service';

export type TakingPictureStatus = 'Off' | 'Pending' | 'Success' | 'Error';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private takingPictureStateSource = new BehaviorSubject<TakingPictureStatus>('Off');
  private takenPictureSource: Photo | null = null;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  async requestCameraPermissions(): Promise<{
    camera: 'granted' | 'denied';
    photos: 'granted' | 'denied';
   }> {
      const permissionStatus = await Camera.requestPermissions();
      return {
        camera: permissionStatus.camera === 'granted' ? 'granted' : 'denied',
        photos: permissionStatus.photos === 'granted' ? 'granted' : 'denied',
      };
  }

  async takePicture(): Promise<string | null> {
    const hasPermission = this.requestCameraPermissions();
    if (!hasPermission) {
      return null;
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      webUseInput: true,
      resultType: CameraResultType.Base64, // Ensures the result is returned as Base64
      source: CameraSource.Prompt, // Gives the user the choice to take a photo or pick one
      promptLabelPhoto: 'Choose from library', // Label for the "Choose from library" option
      promptLabelPicture: 'Take a photo', // Label for the "Take a photo" option
      promptLabelCancel: 'Cancel', // Label for the "Cancel" option
    });

    if (image?.base64String) {
      //console.log('Image captured:', image);
      //console.log('Base64 string:', image.base64String); // Image in Base64 format
      // Call the method to process the image
      //this.processImage(image)
      this.setTakingPictureStatus('Pending');
      this.takenPictureSource = image;
      return image.base64String;
    }
    //this.prepareFormDataForBase64(image.base64String);
    return null;
  }

  async processImage(photo: Photo): Promise<Blob | null> {
    // Enure that the base64 string is present
    if (!photo.base64String) {
      console.error('No base64 image data found');
      return null;
    }

    // Convert base64 to Blob
    const imageBlob = this.base64ToBlob(photo.base64String, 'image/jpeg');

    // Log the blob to see its details
    //console.log("Convert Image Blob",  imageBlob)
    this.prepareFormData(imageBlob);
    return imageBlob;
  }

  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data); // Decode the base64 string
    // atob(): its function that decode a base64-encoded string into a plain text string
    // where each character represents one byte of the original data

    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));

    const byteArray = new Uint8Array(byteNumbers); // Required format for a Blob
    // Unit8Array is typed array in JavaScript that represents an array of 8-bit unsigned integers
    // Its a way of storing byte values (0-255) in an array

    return new Blob([byteArray], { type: contentType }); // Create the Blob with the correct type
    // Blob (binary large object): this binary data is used to create a Blob, which can be upload or saved as a file
    // Blob used to represent large chunks of binary data as audio, video or others
  }

  async prepareFormData(imageBlob: Blob): Promise<FormData> {
    // Create a FormData object to send the image as 'multipart/form-data'
    const formData = new FormData();

    // Append the image blob to the form data, setting the field name as file
    const fileName = `${Date.now()}-image.jpg`;
    formData.append('photo', imageBlob, fileName);

    // At this point, the image is ready to be sent to the backend
    console.log(formData);

    // Call the method to upload this FormData (this part will be handled later)
    // await this.uploadToBackend(formData);
    return formData;
  }

  async setTakingPictureStatus(status: TakingPictureStatus): Promise<void> {
    // Set the status of the image capture process
    // This can be used to to sure confirm and save the image
    if (status === 'Success') {
      if (this.takenPictureSource) {
        //const formData = this.prepareFormDataForBase64(this.takenPictureSource);
        const imageBlob = await this.processImage(this.takenPictureSource);
        if (imageBlob) {
          const formData = await this.prepareFormData(imageBlob);
          this.authService.updateMe(formData).subscribe({
            next: () => {
              this.accountService.fetchAccount().subscribe();
            },
            error: (error) => {
              console.error('Error uploading photo:', error);
            },
          });
        }
      }
    }
    this.takingPictureStateSource.next(status);
  }

  get getTakingPictureStatus(): Observable<TakingPictureStatus> {
    return this.takingPictureStateSource.asObservable();
  }
  onTakePicture(): void{
    this.takePicture();
  }
}
