import { Preferences } from "@capacitor/preferences";

export class KeyPairGenerator {

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

  static async  saveKeys(privateKey: string, publicKey: string) {
    await Preferences.set({ key: 'privateKey', value: privateKey });
    await Preferences.set({ key: 'publicKey', value: publicKey });
  }

  static async  getKey(keyName: string): Promise<string | null> {
    const { value } = await Preferences.get({ key: keyName });
    return value;
  }

  static async generateSessionKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM", // AES-GCM is a symmetric encryption algorithm
        length: 256, // 256-bit key
      },
      true, // Whether the key is extractable (can be used for export)
      ["encrypt", "decrypt"] // Key usage
    );
    return key;
  }
}
