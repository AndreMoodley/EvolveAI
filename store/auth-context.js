import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { refreshToken as fetchNewToken } from '../util/http';

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  isAdmin: false,
  userId: null,
  role: null,
  authenticate: (token, userId, role) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [authRole, setAuthRole] = useState(null);

  useEffect(() => {
    async function initializeAuth() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedExpirationDate = await AsyncStorage.getItem('tokenExpiration');
      const storedRole = await AsyncStorage.getItem('userRole');

      if (storedToken && storedUserId && storedExpirationDate) {
        const expirationDate = new Date(storedExpirationDate);
        const remainingTime = expirationDate.getTime() - new Date().getTime();

        if (remainingTime <= 60000) {
          fetchNewToken(storedToken)
            .then((newToken) => authenticate(newToken, storedUserId, storedRole))
            .catch((error) => {
              console.error('Error refreshing token:', error);
              logout();
            });
        } else {
          authenticate(storedToken, storedUserId, storedRole);
          setTimeout(logout, remainingTime);
        }
      }
    }

    initializeAuth();
  }, []);

  async function authenticate(token, userId, role = 'USER') {
    if (!token || !userId) {
      console.error('Invalid token or userId:', { token, userId });
      return;
    }

    setAuthToken(token);
    setAuthUserId(userId);
    setAuthRole(role);

    try {
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('tokenExpiration', expirationDate.toISOString());
      await AsyncStorage.setItem('userRole', role || 'USER');
    } catch (error) {
      console.error('Error storing data in AsyncStorage:', error);
    }
  }

  async function logout() {
    setAuthToken(null);
    setAuthUserId(null);
    setAuthRole(null);

    try {
      console.log("logout?");
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('tokenExpiration');
      await AsyncStorage.removeItem('userRole');
    } catch (error) {
      console.error('Error removing data from AsyncStorage:', error);
    }
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    isAdmin: authRole === 'ADMIN',
    userId: authUserId,
    role: authRole,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
