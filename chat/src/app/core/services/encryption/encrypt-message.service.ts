import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import * as CryptoJS from 'crypto-js'; // Import CryptoJS for encryption

@Injectable({
  providedIn: 'root'
})

export class EncryptMessageService {
  constructor() {

  }

  async generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // Secure 2048-bit keys
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: "SHA-256",
      },
      true, // Key is extractable (needed for storing)
      ["encrypt", "decrypt"]
    );

    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))), // Convert to Base64
      privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
  }


  async saveKeys(privateKey: string, publicKey: string) {
    await Preferences.set({ key: 'privateKey', value: privateKey });
    await Preferences.set({ key: 'publicKey', value: publicKey });
  }

  async  getKey(keyName: string): Promise<string | null> {
    const { value } = await Preferences.get({ key: keyName });
    return value;
  }
  async encryptMessage(message: string, publicKey: string) {
    const publicKeyArrayBuffer = new Uint8Array(atob(publicKey).split("").map(char => char.charCodeAt(0))).buffer;
    const importedPublicKey = await window.crypto.subtle.importKey(
      "spki", // Format of the public key
      publicKeyArrayBuffer, // Key in ArrayBuffer format
      { name: "RSA-OAEP", hash: "SHA-256" }, // Algorithm details
      false, // Whether key is extractable
      ["encrypt"] // Allowed operations for this key
    );

    const encodedMessage = new TextEncoder().encode(message); // Convert message to ArrayBuffer
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      importedPublicKey,
      encodedMessage
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedMessage))); // Base64 encode encrypted message
  }

  async decryptMessage(encryptedMessage: string, privateKey: string) {
    const privateKeyArrayBuffer = new Uint8Array(atob(privateKey).split("").map(char => char.charCodeAt(0))).buffer;
    const importedPrivateKey = await window.crypto.subtle.importKey(
      "pkcs8", // Format of the private key
      privateKeyArrayBuffer, // Key in ArrayBuffer format
      { name: "RSA-OAEP", hash: "SHA-256" }, // Algorithm details
      false, // Whether key is extractable
      ["decrypt"] // Allowed operations for this key
    );

    const encryptedMessageArrayBuffer = new Uint8Array(atob(encryptedMessage).split("").map(char => char.charCodeAt(0))).buffer;
    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      importedPrivateKey,
      encryptedMessageArrayBuffer
    );

    return new TextDecoder().decode(decryptedMessage); // Convert decrypted ArrayBuffer to string
  }
}
