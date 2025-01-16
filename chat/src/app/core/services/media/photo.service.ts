import { Injectable } from "@angular/core";
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth/auth.service";

export type  TakingPictureStatus = 'Off' | 'Pending' | 'Success' | 'Error';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  private takingPictureStateSource = new BehaviorSubject<TakingPictureStatus>('Off');
  private takenPictureSource: Photo | null =  null;

  constructor(private authService: AuthService){}

  async requestCameraPermissions() {
    const permissionStatus = await Camera.requestPermissions();
    return permissionStatus;
  }


  async takePicture() {
    const hasPermission = this.requestCameraPermissions();
    if (!hasPermission) {
      return;
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      webUseInput: true,
      resultType: CameraResultType.Base64,
      promptLabelPhoto:"Please upload a photo of yourself"
    });

    if (image?.base64String) {
      //console.log('Image captured:', image);
      //console.log('Base64 string:', image.base64String); // Image in Base64 format
      // Call the method to process the image
      //this.processImage(image)
      this.setTakingPictureStatus('Pending');
      this.takenPictureSource = image;
      return image.base64String
    }
    //this.prepareFormDataForBase64(image.base64String);
     return null;
  }

  async processImage(photo: any) {
    // Enure that the base64 string is present
    if (!photo.base64String) {
      console.error('No base64 image data found');
      return;
    }

    // Convert base64 to Blob
    const imageBlob = this.base64ToBlob(photo.base64String, 'image/jpeg');

    // Log the blob to see its details
    //console.log("Convert Image Blob",  imageBlob)
    this.prepareFormData(imageBlob)
    return imageBlob;
  }

  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data); // Decode the base64 string
    // atob(): its function that decode a base64-encoded string into a plain text string
    // where each character represents one byte of the original data

    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));

    const byteArray = new Uint8Array(byteNumbers);// Required format for a Blob
    // Unit8Array is typed array in JavaScript that represents an array of 8-bit unsigned integers
    // Its a way of storing byte values (0-255) in an array

    return new Blob([ byteArray ], { type: contentType }); // Create the Blob with the correct type
    // Blob (binary large object): this binary data is used to create a Blob, which can be upload or saved as a file
    // Blob used to represent large chunks of binary data as audio, video or others
  }

  async prepareFormData(imageBlob: Blob) {
    // Create a FormData object to send the image as 'multipart/form-data'
    const formData = new FormData();

    // Append the image blob to the form data, setting the field name as file
    const fileName = `${Date.now()}-image.jpg`
    formData.append('photo', imageBlob, fileName );

    // At this point, the image is ready to be sent to the backend
    console.log(formData);

    // Call the method to upload this FormData (this part will be handled later)
    // await this.uploadToBackend(formData);
    return formData;
  }

  async setTakingPictureStatus(status: TakingPictureStatus) {
    // Set the status of the image capture process
    // This can be used to to sure confirm and save the image
    if (status === 'Success') {
      if (this.takenPictureSource) {
        //const formData = this.prepareFormDataForBase64(this.takenPictureSource);
        const imageBlob =  await this.processImage(this.takenPictureSource);
        if (imageBlob) {
          const formData = await this.prepareFormData(imageBlob);
          this.authService.updateMe(formData).subscribe({
            next: (response) => {
              console.log('====================================');
              console.log('Photo uploaded:', response);
              console.log('====================================');
            },
            error: (error) => {
              console.error('Error uploading photo:', error);
            }
          });
        }
      }

    }
    this.takingPictureStateSource.next(status);
  }

  get getTakingPictureStatus() {
    return this.takingPictureStateSource.asObservable();
  }
  onTakePicture() {
    this.takePicture();
  }
}
