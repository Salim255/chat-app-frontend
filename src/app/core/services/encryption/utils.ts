export class EncryptionUtils {
  /**
   * Converts a Uint8Array to a Base64-encoded string.
   */
  // Utility function to Base64 encode a Uint8Array
  static toBase64(buffer: Uint8Array): string {
    const encodedBase64 = btoa(String.fromCharCode(...buffer));
    return encodedBase64;
  }
}
