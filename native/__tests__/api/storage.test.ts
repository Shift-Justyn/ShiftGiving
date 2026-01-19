import * as SecureStore from 'expo-secure-store';
import { setSecureItem, getSecureItem, removeSecureItem } from '../../src/lib/storage';

jest.mock('expo-secure-store');

describe('storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setSecureItem', () => {
    it('calls SecureStore setItemAsync', async () => {
      await setSecureItem('key', 'value');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('key', 'value');
    });
  });

  describe('getSecureItem', () => {
    it('returns value from SecureStore', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored-value');
      const result = await getSecureItem('key');
      expect(result).toBe('stored-value');
    });

    it('calls SecureStore getItemAsync', async () => {
      await getSecureItem('key');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('key');
    });
  });

  describe('removeSecureItem', () => {
    it('calls SecureStore deleteItemAsync', async () => {
      await removeSecureItem('key');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('key');
    });
  });
});
