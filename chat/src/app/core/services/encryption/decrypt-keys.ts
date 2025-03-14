import { DeriveKeyFromPassword } from "./derive-Key-from-password";
import { KeyPairGenerator } from "./key-pair-generator";

export class DecryptKeys {
    // Decrypts the private key using the user's password and the stored encrypted data
    static async decryptPrivateKey(encryptedPrivateKey: string, password: string) {
      const decodedData = new Uint8Array(
        atob(encryptedPrivateKey) // Decode the Base64 encoded data
          .split("") // Split into individual characters
          .map((c) => c.charCodeAt(0)) // Convert each character to its charCode
      );

      // Extract the salt (first 16 bytes), IV (next 12 bytes), and encrypted data
      const salt = decodedData.slice(0, 16);
      const iv = decodedData.slice(16, 28);
      const encryptedData = decodedData.slice(28);

      // Derive the AES key using the password and extracted salt
      const key = await DeriveKeyFromPassword.deriveKeyFromPassword(password, salt)

      // Decrypt the encrypted private key using the AES-GCM decryption method
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv }, // AES-GCM mode with the IV
        key, // The AES key for decryption
        encryptedData // The encrypted private key data
      );

      // Decode the decrypted data and return the private key as a string
      return new TextDecoder().decode(decryptedData);
    }

      // Retrieves and decrypts the private key using the user's password
  static async getDecryptedPrivateKey(password: string): Promise<string | null> {
    // Retrieve the encrypted private key from Preferences
    const  value  = await KeyPairGenerator.getKey('privateKey') ;
    if (!value) return null; // Return null if the private key is not found

    // Decrypt the private key using the stored encrypted data and the password
    return this.decryptPrivateKey(value, password);
  }
}
