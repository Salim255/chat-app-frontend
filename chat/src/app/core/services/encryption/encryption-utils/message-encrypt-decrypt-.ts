import { DeriveKeyFromEmail } from "./derive-Key-from-email";

export type MessageEncryptionData = {
  messageText: string,
  senderPublicKeyBase64: string,
  encryptedSessionKey: string | null,
  receiverPublicKeyBase64: string | null,
  senderPrivateKeyBase64: string | null,
  senderEmail: string | null
}
export class MessageEncryptDecrypt {

  /**
   * Generates a new AES-GCM session key.
   * @returns {Promise<CryptoKey>} - The generated AES session key.
   */
  static async generateSessionKey(): Promise<CryptoKey> {
    const key = window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true, // Extractable
        ["encrypt", "decrypt"]
      );
    return key;
  }

   /**
   * Generates a random IV (Initialization Vector) for AES-GCM.
   * @returns {Uint8Array} - The generated IV.
   */
   static generateIV(): Uint8Array {
    const randomIV =  window.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM requires a 12-byte IV
    return randomIV;
  }

  /**
   * Converts a Uint8Array to a Base64-encoded string.
   */
    static toBase64(buffer: Uint8Array): string {
      const encodedBase64 =  btoa(String.fromCharCode(...buffer));
      return encodedBase64;
   }

  /**
   * Converts a Base64-encoded string back to Uint8Array.
   */
   static fromBase64(base64String: string): Uint8Array {
    const uint8Array =  new Uint8Array(atob(base64String).split("").map(char => char.charCodeAt(0)));
    return uint8Array;
   }

  /**
   * Imports an RSA public key from Base64 format.
   */
  static async importPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
    const publicKeyBuffer = this.fromBase64(publicKeyBase64).buffer;
    const rsaPublickey = window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    return rsaPublickey;
  }

  /**
   * Encrypts a session key using an RSA public key.
   * @returns {Promise<string>} - The encrypted session key in Base64 format.
   */
  static async encryptSessionKey(sessionKey: CryptoKey, publicKey: CryptoKey): Promise<string> {
    const sessionKeyBuffer = await window.crypto.subtle.exportKey("raw", sessionKey);
    const encryptedSessionKey = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      sessionKeyBuffer
    );
    const encryptSessionKeyBase64 = this.toBase64(new Uint8Array(encryptedSessionKey));
    return encryptSessionKeyBase64;
  }

   /**
   * Encrypts a message using AES-GCM and a session key.
   * @returns {Promise<string>} - The encrypted message in Base64 format.
   */
   static async encryptMessageWithSessionKey(messageText: string, sessionKey: CryptoKey): Promise<string> {
    const iv = this.generateIV();
    const encoder = new TextEncoder();

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      sessionKey,
      encoder.encode(messageText)
    );

    const encryptMessageWithSessionKeyBase64 =  this.toBase64(iv) + ":" + this.toBase64(new Uint8Array(encryptedData));
    return encryptMessageWithSessionKeyBase64;
  }

 /**
 * Imports an RSA private key from Base64 format, decrypting it using the user's email-derived AES key.
 */
static async importPrivateKey(privateKeyBase64: string, email: string): Promise<CryptoKey> {
  // Decode the Base64 private key data into a Uint8Array
  const privateKeyData = this.fromBase64(privateKeyBase64);

  // Extract the salt and IV from the privateKeyData (assuming it's the concatenation of salt, IV, and encrypted private key)
  const salt = privateKeyData.slice(0, 16); // First 16 bytes as the salt
  const iv = privateKeyData.slice(16, 28);  // Next 12 bytes as the IV
  const encryptedPrivateKey = privateKeyData.slice(28); // Rest is the encrypted private key

  // Derive the AES key from the user's email (used as the password) and the extracted salt
  const aesKey = await DeriveKeyFromEmail.deriveKeyFromEmail(email, salt);

  // Decrypt the private key using AES-GCM with the derived AES key
  const decryptedPrivateKeyBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv }, // AES-GCM with the extracted IV
    aesKey, // The AES key derived from the email
    encryptedPrivateKey // The encrypted private key to be decrypted
  );

  // Now, import the decrypted private key as an RSA private key using PKCS#8 format
  const rsaPrivateKey = await window.crypto.subtle.importKey(
    "pkcs8", // PKCS#8 format for private keys
    decryptedPrivateKeyBuffer, // The decrypted private key buffer
    { name: "RSA-OAEP", hash: "SHA-256" }, // RSA with OAEP padding and SHA-256 hash
    false, // The key is not extractable
    ["decrypt"] // The key will be used for decryption
  );

  return rsaPrivateKey;
}


  /**
   * Decrypts an RSA-encrypted session key using the sender's private key.
   * @param {string} encryptedSessionKey - The session key in Base64 format.
   * @param {CryptoKey} privateKey - The sender's private key.
   * @returns {Promise<CryptoKey>} - The decrypted AES session key.
   */
   static async decryptSessionKey(encryptedSessionKey: string, privateKey: CryptoKey): Promise<CryptoKey> {
    const encryptedBuffer = this.fromBase64(encryptedSessionKey);
    const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedBuffer
    );

    return window.crypto.subtle.importKey(
      "raw",
      decryptedKeyBuffer,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

   /**
   * Encrypts a message securely, handling session key decryption if necessary.
   *
   * @param {string} messageText - The message to encrypt.
   * @param {string | null} encryptedSessionKey - The session key encrypted with the sender's public key (or null).
   * @param {string} senderPublicKeyBase64 - The sender's public key in Base64 (for encrypting a new session key).
   * @param {string} receiverPublicKeyBase64 - The receiver's public key in Base64 (so the receiver can decrypt the session key).
   * @param {string | null} senderPrivateKeyBase64 - The sender's private key in Base64 (needed if encryptedSessionKey is provided).
   * @returns {Promise<{ encryptedMessage: string; encryptedSessionKeyForSender?: string; encryptedSessionKeyForReceiver?: string }>}
   */
   static async encryptMessage(
    encryptionData: MessageEncryptionData
  ): Promise<{ encryptedMessage: string; encryptedSessionKeyForSender?: string; encryptedSessionKeyForReceiver?: string }> {
    console.log(encryptionData)
    let sessionKey!: CryptoKey ;
    let encryptedSessionKeyForSender: string | undefined;
    let encryptedSessionKeyForReceiver: string | undefined;

    if (!encryptionData.encryptedSessionKey &&  encryptionData.receiverPublicKeyBase64 ) {

      // Generate a new session key
      sessionKey = await this.generateSessionKey();

      // Encrypt session key for both sender and receiver
      const senderPublicKey = await this.importPublicKey( encryptionData.senderPublicKeyBase64);
      const receiverPublicKey = await this.importPublicKey( encryptionData.receiverPublicKeyBase64);

      encryptedSessionKeyForSender = await this.encryptSessionKey(sessionKey, senderPublicKey);
      encryptedSessionKeyForReceiver = await this.encryptSessionKey(sessionKey, receiverPublicKey);
    } else if ( encryptionData.encryptedSessionKey &&  encryptionData.senderEmail) {
      console.log("Hellof rom second codntion")
      // Ensure sender's private key is provided
      if (!encryptionData.senderPrivateKeyBase64 ) {
        throw new Error("Sender's private key is required to decrypt the session key.");
      }

      // Decrypt the session key using the sender's private key
      const senderPrivateKey = await this.importPrivateKey( encryptionData.senderPrivateKeyBase64,  encryptionData.senderEmail );
      sessionKey = await this.decryptSessionKey( encryptionData.encryptedSessionKey, senderPrivateKey );

      // Receiver already has the session key, so we **DO NOT** send it again
    }

    // Encrypt the message with the session key
    console.log("From last condtion")
    const encryptedMessage =  await this.encryptMessageWithSessionKey( encryptionData.messageText, sessionKey );

    return  encryptionData.encryptedSessionKey
      ? { encryptedMessage } // Sender reuses session key, no need to send it again
      : { encryptedMessage, encryptedSessionKeyForSender, encryptedSessionKeyForReceiver };
  }

}
