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

    if (image) {
      //console.log('Image captured:', image);
      //console.log('Base64 string:', image.base64String); // Image in Base64 format
      // Call the method to process the image
      this.processImage(image)
    }
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
    const fileName = `${Date.now()}-image-.jpg`
    formData.append('file', imageBlob, fileName );

    // At this point, the image is ready to be sent to the backend
    console.log(formData);

    // Call the method to upload this FormData (this part will be handled later)
    // await this.uploadToBackend(formData);
  }

  onTakePicture() {
    this.takePicture();
  }
}