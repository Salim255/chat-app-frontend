export class MessageEncryptionDecryption {
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
