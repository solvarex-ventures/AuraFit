// SecureStore doesn't exist on web, and localStorage doesn't exist on
// native — this file is the one place that branches on Platform so nothing
// else in the app has to.
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'aurafit_token';

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      window.localStorage.setItem(KEY, token);
    } catch {
      // localStorage can throw in private-browsing contexts — non-fatal.
    }
    return;
  }
  await SecureStore.setItemAsync(KEY, token);
}

export async function loadToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return window.localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(KEY);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    return;
  }
  await SecureStore.deleteItemAsync(KEY);
}
