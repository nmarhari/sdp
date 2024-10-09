import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store'; // Assuming you're using expo-secure-store
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

// Dexcom OAuth endpoints (replace with your own if needed)
const discovery = {
  authorizationEndpoint: 'https://api.dexcom.com/v2/oauth2/login',
  tokenEndpoint: 'https://api.dexcom.com/v2/oauth2/token',
};

export default function DexcomLogin() {
  const redirectUri = makeRedirectUri({
    scheme: 'yourappscheme', // The scheme from app.json
  });

  // Create the request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Exc6hrFQoZtwuSwD5i3OWHt1LuGLuQ47', // Replace with your Dexcom client ID
      scopes: ['offline_access'],
      redirectUri: redirectUri, // Use the generated redirect URI
    },
    discovery // Dexcom's OAuth discovery information
  );

  // Handle the response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization code:', code);
      // Exchange code for token
      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code) => {
    // Implement token exchange via your backend
    // This is a placeholder for demonstration purposes
    try {
      const response = await fetch('https://your-backend.com/exchange-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUri }),
      });

      const tokenResponse = await response.json();
      // Save the token to SecureStore
      await SecureStore.setItemAsync('dexcomAuthState', JSON.stringify(tokenResponse));
      return tokenResponse;
    } catch (error) {
      console.error('Token exchange failed', error);
    }
  };

  const fetchGlucoseData = async () => {
    try {
      const storedAuthState = await SecureStore.getItemAsync('dexcomAuthState');
  
      const response = await fetch('https://api.dexcom.com/v2/users/self/egvs', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Glucose Data:', data);
    } catch (error) {
      console.error('Failed to fetch glucose data', error);
    }
  };

  const dexcomLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('dexcomAuthState');
      console.log('Logged out');
    } catch (error) {
      console.error('Failed to log out', error);
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
    </View>
  );
}
