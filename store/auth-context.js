import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { refreshToken as fetchNewToken } from '../util/http';

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  userId: null,
  authenticate: (token, userId) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);

  useEffect(() => {
    async function initializeAuth() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedExpirationDate = await AsyncStorage.getItem('tokenExpiration');

      if (storedToken && storedUserId && storedExpirationDate) {
        const expirationDate = new Date(storedExpirationDate);
        const remainingTime = expirationDate.getTime() - new Date().getTime();

        if (remainingTime <= 60000) {
          fetchNewToken(storedToken)
            .then((newToken) => authenticate(newToken, storedUserId))
            .catch((error) => {
              console.error('Error refreshing token:', error);
              logout();
            });
        } else {
          authenticate(storedToken, storedUserId);
          setTimeout(logout, remainingTime); // Auto-logout after token expires
        }
      }
    }

    initializeAuth();
  }, []);

  async function authenticate(token, userId) {
    if (!token || !userId) {
      console.error('Invalid token or userId:', { token, userId });
      return;
    }

    setAuthToken(token);
    setAuthUserId(userId);

    try {
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('tokenExpiration', expirationDate.toISOString());
    } catch (error) {
      console.error('Error storing data in AsyncStorage:', error);
    }
  }

  async function logout() {
    setAuthToken(null);
    setAuthUserId(null);

    try {
      console.log("logout?");
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('tokenExpiration');
    } catch (error) {
      console.error('Error removing data from AsyncStorage:', error);
    }
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    userId: authUserId,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
