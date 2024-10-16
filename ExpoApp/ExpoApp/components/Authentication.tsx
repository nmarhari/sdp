import React, { useEffect, useState } from 'react';
import { Button, View, Text } from 'react-native';  // Make sure to import Text
import AsyncStorage from '@react-native-async-storage/async-storage'; // Replacing SecureStore with AsyncStorage
import { useAuthRequest } from 'expo-auth-session';
import { Linking } from 'react-native';

// Dexcom OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/login',
  tokenEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/token',
};

export default function DexcomLogin() {
  const [authCode, setAuthCode] = useState(null);
  const [error, setError] = useState(null);

  // Redirect URI (using localhost for now)
  const redirectUri = 'http://localhost:8081';  // Replace with your localhost URL

  // Create the authorization request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Exc6hrFQoZtwuSwD5i3OWHt1LuGLuQ47',
      scopes: ['offline_access'],
      redirectUri: redirectUri,
    },
    discovery
  );

  // Capture the URL when the redirect happens
  useEffect(() => {
    const handleUrl = (url) => {
      const parsedUrl = new URL(url);
      const code = parsedUrl.searchParams.get('code');
      if (code) {
        setAuthCode(code);
        console.log('Authorization code captured:', code);
        exchangeCodeForToken(code);
      } else {
        setError('Authorization code not found in URL');
      }
    };

    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    // Check if we already have an incoming URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Exchange code for token using your Flask backend
  const exchangeCodeForToken = async (code) => {
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
        expires_in: tokenResponse.expires_in,  // Optionally store the expiry time for token refresh logic
      }));
  
      console.log('Token exchange successful:', tokenResponse);
      return tokenResponse;
    } catch (error) {
      console.error('Token exchange failed', error);
      setError('Token exchange failed: ' + error.message);
    }
  };
  
  // Fetch glucose data using the stored access token
  const fetchGlucoseData = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem('dexcomAuthState');
      if (!storedAuthState) {
        throw new Error('No stored authentication state. Please log in again.');
      }
      const authState = JSON.parse(storedAuthState);
  
      // Make a request to your Flask backend, which proxies the Dexcom API request
      const response = await fetch('http://127.0.0.1:5000/fetch-glucose-data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.access_token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch glucose data with status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Glucose Data:', data);
    } catch (error) {
      console.error('Failed to fetch glucose data', error);
    }
  };
  
  // Logout by deleting the stored access token
  const dexcomLogout = async () => {
    try {
      await AsyncStorage.removeItem('dexcomAuthState');
      console.log('Logged out');
    } catch (error) {
      console.error('Failed to log out', error);
      setError('Failed to log out: ' + error.message);
    }
  };

  return (
    <View>
      <Button
        title="Login with Dexcom"
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      />
      <Button title="Fetch Glucose Data" onPress={fetchGlucoseData} />
      <Button title="Logout" onPress={dexcomLogout} />

      {/* Display authorization code if available */}
      {authCode && <Text>Authorization Code: {authCode}</Text>}
      
      {/* Display errors if any */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}
