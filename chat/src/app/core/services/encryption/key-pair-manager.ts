import { Preferences } from '@capacitor/preferences';
import { EncryptionUtils } from './utils';

export class KeyPairManager {
  static async generateKeyPair() {
    // Generates an RSA key pair and exports the public and private keys in Base64 format
    const keyPair = await self.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048, // 2048-bit key for security
        publicExponent: new Uint8Array([1, 0, 1]), // Exponent for the RSA encryption
        hash: 'SHA-256',
      },
      true, // Key is extractable (needed for storing) or the key can be exported
      ['encrypt', 'decrypt'] // The key will be used for encryption and decryption
    );

    // Export the public and private keys in a standardized format
    const publicKey = await self.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await self.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      // Convert the keys to Base64 format (for easier storage)
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))), // Convert to Base64
      privateKey,
    };
  }

  static async getPrivatePublicKeys(email: string) {
    // Generate keys ///
    const { publicKey, privateKey } = await this.generateKeyPair();

    // Derive key from email
    const encryptedPrivateKey = await this.encryptPrivateKey(privateKey, email);
    return { publicKey, privateKey: encryptedPrivateKey };
  }

  static async GetCurrentUserKeys() {
    const userPublicKey = await Preferences.get({ key: 'authData' });
    if (!userPublicKey.value) return;

    const parsedData = JSON.parse(userPublicKey.value) as {
      _privateKey: string;
      _publicKey: string;
    };

    const publicKey = parsedData._publicKey;
    const privateKey = parsedData._privateKey;

    return { privateKey, publicKey };
  }

  // Encrypts the private key with the user's password using AES-GCM
  static async encryptPrivateKey(privateKey: ArrayBuffer, email: string): Promise<string> {
    const salt = self.crypto.getRandomValues(new Uint8Array(16)); // Random salt
    const iv = self.crypto.getRandomValues(new Uint8Array(12)); // Random IV

    // Derive AES key from email
    const key = await this.deriveKeyFromEmail(email, salt);

    // Encrypt the private key (as an ArrayBuffer)
    const encryptedData = await self.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      privateKey // Encrypting the raw ArrayBuffer of the key
    );

    // Concatenate salt, IV, and encrypted data
    const combinedData = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedData)]);

    // Convert to Base64
    return EncryptionUtils.toBase64(combinedData);
  }

  // Derives an AES key from the user email using PBKDF2 (Email-Based Key Derivation Function 2)
  static async deriveKeyFromEmail(email: string, salt: Uint8Array) {
    const encoder = new TextEncoder();
    // Convert the email string into a Uint8Array (this will be used as key material)
    const emailBytes = encoder.encode(email);

    // Import the email as raw key material to be used in PBKDF2
    const keyMaterial = await self.crypto.subtle.importKey(
      'raw', // The email is used as raw key material
      emailBytes, // Email as key material
      { name: 'PBKDF2' }, // PBKDF2 is the key derivation function
      false, // Key is not extractable
      ['deriveKey'] // The key will be derived for encryption
    );

    // Use PBKDF2 to derive the AES key (256-bit) from the email and salt
    const derivedKey = self.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt, // The salt value for key derivation
        iterations: 100000, // High iteration count for increased security
        hash: 'SHA-256', // Use SHA-256 as the hash function
      },
      keyMaterial, // The key material derived from the email
      { name: 'AES-GCM', length: 256 }, // Use AES-GCM for encryption with a 256-bit AES key
      true, // The derived key will be exportable
      ['encrypt', 'decrypt'] // The key will be used for both encryption and decryption
    );

    return derivedKey;
  }
}
