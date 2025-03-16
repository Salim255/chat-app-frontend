export class DeriveKeyFromEmail {
    // Derives an AES key from the user email using PBKDF2 (Email-Based Key Derivation Function 2)
    static async deriveKeyFromEmail(email: string, salt: Uint8Array) {
      const encoder = new TextEncoder();
      // Convert the email string into a Uint8Array (this will be used as key material)
      const emailBytes = encoder.encode(email);

      // Import the email as raw key material to be used in PBKDF2
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw", // The email is used as raw key material
        emailBytes, // Email as key material
        { name: "PBKDF2" }, // PBKDF2 is the key derivation function
        false, // Key is not extractable
        ["deriveKey"] // The key will be derived for encryption
      );

      // Use PBKDF2 to derive the AES key (256-bit) from the email and salt
      const derivedKey =  window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt, // The salt value for key derivation
          iterations: 100000, // High iteration count for increased security
          hash: "SHA-256", // Use SHA-256 as the hash function
        },
        keyMaterial, // The key material derived from the email
        { name: "AES-GCM", length: 256 }, // Use AES-GCM for encryption with a 256-bit AES key
        true, // The derived key will be exportable
        ["encrypt", "decrypt"] // The key will be used for both encryption and decryption
      );

      return  derivedKey;
    }
}
