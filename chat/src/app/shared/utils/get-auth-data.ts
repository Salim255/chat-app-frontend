import { Preferences } from '@capacitor/preferences';

export class GetAuthData {
  public static async getAuthData() {
    try {
      const storedData = await Preferences.get({ key: 'authData' });

      if (!storedData?.value) {
        throw new Error('No stored authentication data found');
      }

      const parsedData = JSON.parse(storedData.value);

      if (!parsedData._privateKey || !parsedData._email) {
        throw new Error('Invalid authentication data format');
      }

      return parsedData as {
        _privateKey: string;
        _publicKey: string;
        _email: string;
      };
    } catch (error) {
      console.error('Failed to retrieve auth data:', error);
      throw new Error('Authentication data retrieval failed');
    }
  }
}
