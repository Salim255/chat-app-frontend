import { DeriveKeyFromEmail } from "./derive-Key-from-email";

export class EncryptPrivateKey {
    // Encrypts the private key with the user's password using AES-GCM
    static async encryptPrivateKey(privateKey: string, email: string) {
      const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Random salt for password-based key derivation
      const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Random initialization vector (IV) for AES-GCM

      // Derive the AES key from the password and salt
      const key = await DeriveKeyFromEmail.deriveKeyFromEmail(email, salt);

      // Encrypt the private key using the derived AES key
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv }, // AES-GCM mode with the random IV
        key, // The AES key for encryption
        new TextEncoder().encode(privateKey) // Convert the private key to an array of bytes
      );

      // Return the Base64 encoded combination of salt, IV, and encrypted private key for storage
      return btoa(
        String.fromCharCode(...salt) +
        String.fromCharCode(...iv) +
        String.fromCharCode(...new Uint8Array(encryptedData))
      );
    }

}
