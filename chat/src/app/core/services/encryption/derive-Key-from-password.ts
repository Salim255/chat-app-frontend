export class DeriveKeyFromPassword {
      // Derives an AES key from the user password using PBKDF2 (Password-Based Key Derivation Function 2)
      static async deriveKeyFromPassword(password: string, salt: Uint8Array) {
        const encoder = new TextEncoder();
        // Import the password as a raw key to be used in PBKDF2
        const keyMaterial = await window.crypto.subtle.importKey(
          "raw",
          encoder.encode(password),
          { name: "PBKDF2" }, // PBKDF2 is the key derivation function
          false, // Key is not extractable
          ["deriveKey"] // The key will be derived for encryption
        );

        // Use PBKDF2 to derive the AES key (256-bit) from the password and salt
        return window.crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt,
            iterations: 100000, // High iteration count for increased security
            hash: "SHA-256", // Secure hash algorithm
          },
          keyMaterial, // The key material derived from the password
          { name: "AES-GCM", length: 256 }, // Use AES-GCM for encryption
          true, // The key will be exportable
          ["encrypt", "decrypt"] // The key will be used for both encryption and decryption
        );
      }
}
