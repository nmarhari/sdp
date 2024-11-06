import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthRequest } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { initDB, insertUser } from './dbInit.js'; // Import the database functions
import { Alert } from 'react-native';

// Dexcom OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/login',
  tokenEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/token',
};

// Redirect URI
const redirectUri = 'CarbCounter://*';  // Replace with your app's redirect URI

// Client ID for Dexcom (replace with your own client ID)
const clientId = 'Exc6hrFQoZtwuSwD5i3OWHt1LuGLuQ47';


// Hook to set up the authorization request and capture the response
export function useDexcomAuth() {
  const [authCode, setAuthCode] = useState(null);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['offline_access'],
      redirectUri,
    },
    discovery
  );

  // Listen for the authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      setAuthCode(code);
      exchangeCodeForToken(code);
    }
  }, [response]);

  return {
    request,
    promptAsync,
    authCode,
    error,
    setError,
  };
}

// Function to exchange authorization code for an access token
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/exchange-code', {  // Replace with your Flask server URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirectUri }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed with status: ${response.status}`);
    }

    const tokenResponse = await response.json();

    // Save both the access token and refresh token to AsyncStorage
    await AsyncStorage.setItem('dexcomAuthState', JSON.stringify({
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_in: tokenResponse.expires_in,
    }));

    console.log('Token exchange successful:', tokenResponse);

    // Insert the token into the User table
    await insertUser(db, 1.0, tokenResponse.access_token);  // Replace `1.0` with actual carb-to-insulin ratio if available

    return tokenResponse;
  } catch (error) {
    console.error('Token exchange failed', error);
    throw new Error('Token exchange failed: ' + error.message);
  }
};

// Function to fetch glucose data
export const fetchGlucoseData = async () => {
  try {
    const storedAuthState = await AsyncStorage.getItem('dexcomAuthState');
    if (!storedAuthState) throw new Error('Please log in again.');

    const { access_token } = JSON.parse(storedAuthState);
    const response = await fetch('http://127.0.0.1:5000/fetch-glucose-data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const glucoseData = await response.json();
    console.log('Glucose Data:', glucoseData);
    return glucoseData;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Function to log out by removing the token from storage
export const dexcomLogout = async () => {
  try {
    await AsyncStorage.removeItem('dexcomAuthState');
    console.log('Logged out');
  } catch (error) {
    console.error('Failed to log out', error);
    throw error;
  }
};
