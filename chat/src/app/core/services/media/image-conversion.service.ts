import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ImageConversionService {

  base64ToBlob(base64Data: string): Blob {
    const byteCharacters = atob(base64Data); // Decode the base64 string
    // atob(): its function that decode a base64-encoded string into a plain text string
    // where each character represents one byte of the original data

    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));

    const byteArray = new Uint8Array(byteNumbers); // Required format for a Blob
    // Unit8Array is typed array in JavaScript that represents an array of 8-bit unsigned integers
    // Its a way of storing byte values (0-255) in an array

    return new Blob([byteArray], { type: 'image/jpeg' }); // Create the Blob with the correct type
    // Blob (binary large object): this binary data is used to create a Blob, which can be upload or saved as a file
    // Blob used to represent large chunks of binary data as audio, video or others
  }

  toFormData(imageBlob: Blob): FormData {
    // Create a FormData object to send the image as 'multipart/form-data'
    const formData = new FormData();

    // Append the image blob to the form data, setting the field name as file
    formData.append('photo', imageBlob);
//
    // At this point, the image is ready to be sent to the backend
    // Call the method to upload this FormData (this part will be handled later)
    // await this.uploadToBackend(formData);
    return formData;
  }
}
