import { KeyPairGenerator } from "./key-pair-generator";
import { EncryptKeys } from "./encrypt-keys";
export class PrivatePublicKeys {
  constructor(){}

  static async PrivatePublicKeys(password: string) {
    // Generate keys ///
    const { publicKey, privateKey } = await KeyPairGenerator.generateKeyPair();

    // Derive key from password
    const encryptedPrivateKey =  await EncryptKeys.encryptPrivateKey(privateKey, password );
    return { publicKey, privateKey: encryptedPrivateKey}
  }
}
