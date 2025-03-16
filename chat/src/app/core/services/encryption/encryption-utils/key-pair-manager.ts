import { Preferences } from "@capacitor/preferences";
import { EncryptPrivateKey } from "./encrypt-private-key";

export class KeyPairManager {
  static async  generateKeyPair() {
    // Generates an RSA key pair and exports the public and private keys in Base64 format
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // 2048-bit key for security
        publicExponent: new Uint8Array([1, 0, 1]),  // Exponent for the RSA encryption
        hash: "SHA-256",
      },
      true, // Key is extractable (needed for storing) or the key can be exported
      ["encrypt", "decrypt"] // The key will be used for encryption and decryption
    );

    // Export the public and private keys in a standardized format
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    return {
      // Convert the keys to Base64 format (for easier storage)
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))), // Convert to Base64
      privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
  }

  static async getPrivatePublicKeys(email: string) {
    // Generate keys ///
    const { publicKey, privateKey } = await KeyPairManager.generateKeyPair();

    // Derive key from password
    const encryptedPrivateKey =  await EncryptPrivateKey.encryptPrivateKey(privateKey, email );
    return { publicKey, privateKey: encryptedPrivateKey}
  }

  static async GetCurrentUserKeys() {
    const userPublicKey = await Preferences.get({key: 'authData'});
    if (!userPublicKey.value) return;

    const parsedData = JSON.parse(userPublicKey.value) as {
      _privateKey: string,
      _publicKey: string
    };

    const publicKey = parsedData._publicKey;
    const privateKey = parsedData._privateKey;

    return { privateKey, publicKey }
  }
}
