import { KeyPairManager } from "./key-pair-manager";
import { EncryptionUtils } from "./utils";

export type MessageEncryptionData = {
  messageText: string,
  senderPublicKeyBase64: string | null,
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
    const key = self.crypto.subtle.generateKey(
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
    const randomIV =  self.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM requires a 12-byte IV
    return randomIV;
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
    const rsaPublickey = self.crypto.subtle.importKey(
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
    const sessionKeyBuffer = await self.crypto.subtle.exportKey("raw", sessionKey);
    const encryptedSessionKey = await self.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      sessionKeyBuffer
    );
    const encryptSessionKeyBase64 = EncryptionUtils.toBase64(new Uint8Array(encryptedSessionKey));
    return encryptSessionKeyBase64;
  }

   /**
   * Encrypts a message using AES-GCM and a session key.
   * @returns {Promise<string>} - The encrypted message in Base64 format.
   */
   static async encryptMessageWithSessionKey(messageText: string, sessionKey: CryptoKey): Promise<string> {
    const iv = this.generateIV();
    const encoder = new TextEncoder();

    const encryptedData = await self.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      sessionKey,
      encoder.encode(messageText)
    );

    const encryptMessageWithSessionKeyBase64 =  EncryptionUtils.toBase64(iv) + ":" + EncryptionUtils.toBase64(new Uint8Array(encryptedData));
    return encryptMessageWithSessionKeyBase64;
  }

  /**
   * Decrypts a message using AES-GCM with the provided session key.
   * @param {string} encryptedMessage - The encrypted message in Base64 format (IV:Ciphertext).
   * @param {CryptoKey} sessionKey - The decrypted AES session key.
   * @returns {Promise<string>} - The decrypted plaintext message.
   */
  static async decryptMessageWithSessionKey(encryptedMessage: string, sessionKey: CryptoKey): Promise<string> {
    // Split the IV and Ciphertext
    const [ivBase64, ciphertextBase64] = encryptedMessage.split(":");
    if (!ivBase64 || !ciphertextBase64) {
      throw new Error("Invalid encrypted message format.");
    }

    // Convert Base64 to Uint8Array
    const iv = this.fromBase64(ivBase64);
    const ciphertext = this.fromBase64(ciphertextBase64);

    // Decrypt using AES-GCM
    const decryptedBuffer = await self.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      sessionKey,
      ciphertext
    );

    // Decode back to string
    return new TextDecoder().decode(decryptedBuffer);
  }

 /**
 * Imports an RSA private key from Base64 format, decrypting it using the user's email-derived AES key.
 */
 static async importPrivateKey(privateKeyBase64: string, email: string): Promise<CryptoKey> {
  // Decode Base64 to Uint8Array
  const privateKeyData = this.fromBase64(privateKeyBase64);

  // Extract salt, IV, and encrypted private key
  const salt = privateKeyData.slice(0, 16);
  const iv = privateKeyData.slice(16, 28);
  const encryptedPrivateKey = privateKeyData.slice(28);

  // Derive the AES key from email
  const aesKey = await KeyPairManager.deriveKeyFromEmail(email, salt);

  // Decrypt the private key
  const decryptedPrivateKeyBuffer = await self.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encryptedPrivateKey
  );

  // Import the decrypted private key as an RSA private key
  return await self.crypto.subtle.importKey(
    "pkcs8",
    decryptedPrivateKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
}



  /**
   * Decrypts an RSA-encrypted session key using the sender's private key.
   * @param {string} encryptedSessionKey - The session key in Base64 format.
   * @param {CryptoKey} privateKey - The sender's private key.
   * @returns {Promise<CryptoKey>} - The decrypted AES session key.
   */
   static async decryptSessionKey(encryptedSessionKeyBase64: string, privateKey: CryptoKey): Promise<CryptoKey> {
    const encryptedBuffer = this.fromBase64(encryptedSessionKeyBase64);
    const decryptedKeyBuffer = await self.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedBuffer
    );

    return self.crypto.subtle.importKey(
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
  ): Promise<{ encryptedMessageBase64: string; encryptedSessionKeyForSenderBase64?: string; encryptedSessionKeyForReceiverBase64?: string }> {

    let sessionKey!: CryptoKey ;
    let encryptedSessionKeyForSenderBase64: string | undefined;
    let encryptedSessionKeyForReceiverBase64: string | undefined;

    console.log( encryptionData, "hello data ")
    if (!encryptionData.encryptedSessionKey &&  encryptionData.receiverPublicKeyBase64 && encryptionData.senderPublicKeyBase64 ) {

      // Generate a new session key
      sessionKey = await this.generateSessionKey();

      // Encrypt session key for both sender and receiver
      const senderPublicKey = await this.importPublicKey( encryptionData.senderPublicKeyBase64);
      const receiverPublicKey = await this.importPublicKey( encryptionData.receiverPublicKeyBase64);

      encryptedSessionKeyForSenderBase64 = await this.encryptSessionKey(sessionKey, senderPublicKey);
      encryptedSessionKeyForReceiverBase64 = await this.encryptSessionKey(sessionKey, receiverPublicKey);
    } else if ( encryptionData.encryptedSessionKey &&  encryptionData.senderEmail) {
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
    const encryptedMessageBase64=  await this.encryptMessageWithSessionKey( encryptionData.messageText, sessionKey );

    if ( encryptedSessionKeyForSenderBase64 &&  encryptionData.senderPrivateKeyBase64 && encryptionData.senderEmail) {

      const decryptedMessage = await this.decryptMessage(
        encryptedMessageBase64,
        encryptedSessionKeyForSenderBase64,
        encryptionData.senderPrivateKeyBase64,
        encryptionData.senderEmail );
        console.log("Testing decrypt", decryptedMessage )
    }

    if (encryptionData.encryptedSessionKey &&  encryptionData.senderPrivateKeyBase64 && encryptionData.senderEmail) {
      const decryptedMessage = await this.decryptMessage(
        encryptedMessageBase64,
        encryptionData.encryptedSessionKey,
        encryptionData.senderPrivateKeyBase64,
        encryptionData.senderEmail );
        console.log("Testing decrypt", decryptedMessage )
    }


    return  encryptionData.encryptedSessionKey
      ? { encryptedMessageBase64 } // Sender reuses session key, no need to send it again
      : { encryptedMessageBase64, encryptedSessionKeyForSenderBase64, encryptedSessionKeyForReceiverBase64 };
  }

    /**
   * Decrypts a message securely, handling session key decryption if necessary.
   *
   * @param {string} encryptedMessage - The encrypted message.
   * @param {string | null} encryptedSessionKey - The encrypted session key (Base64, if provided).
   * @param {string} receiverPrivateKeyBase64 - The receiver's private key in Base64 (for decrypting the session key).
   * @param {string | null} receiverEmail - The receiver's email (for decrypting the private key).
   * @returns {Promise<string>} - The decrypted plaintext message.
   */
    static async decryptMessage(
      encryptedMessageBase64: string,
      encryptedSessionKeyBase64: string,
      receiverPrivateKeyBase64: string,
      receiverEmail: string
    ): Promise<string> {
      try {
        let sessionKey!: CryptoKey;

        // If an encrypted session key is provided, decrypt it
        if (encryptedSessionKeyBase64 && receiverEmail) {

          const receiverPrivateKey = await this.importPrivateKey(receiverPrivateKeyBase64, receiverEmail);
          sessionKey = await this.decryptSessionKey(encryptedSessionKeyBase64, receiverPrivateKey);
        } else {
          throw new Error("Encrypted session key or private key information is missing. i else condtion");
        }

        // Decrypt the message with the session key
        return await this.decryptMessageWithSessionKey(encryptedMessageBase64, sessionKey);
      } catch (error) {
        throw new Error("Encrypted session key or private key information is missing");
      }
    }

}
