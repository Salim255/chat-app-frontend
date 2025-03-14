import { Injectable } from '@angular/core';
import { IdentityKeyPair } from '@signalapp/libsignal-client';
import * as libsignal from '@signalapp/libsignal-client';
@Injectable({
  providedIn: 'root',
})
export class SignalService {
  //private signalStore = new SignalStore(); // Ensure SignalStore is defined properly
  constructor() {

  }
  async generateKeys() {
    console.log(libsignal, "hello form test signal")
    try {
      // Generate identity key pair
      const identityKeyPair = await IdentityKeyPair.generate();

      // Generate prekeys
      //const preKey = await PreKey.generate(1);
      //const signedPreKey = await SignedPreKey.generate(1, identityKeyPair);

      // Store keys
      //this.signalStore.set('identityKey', identityKeyPair.serialize());
     // this.signalStore.set('preKey', preKey.serialize());
     // this.signalStore.set('signedPreKey', signedPreKey.serialize());
    } catch (error) {
      console.error('Error generating keys:', error);
    }
  }
}
