import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store'; // Assuming you're using expo-secure-store
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

// Dexcom OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://api.dexcom.com/v2/oauth2/login',
  tokenEndpoint: 'https://api.dexcom.com/v2/oauth2/token',
};

export default function DexcomLogin() {
  // Create the redirect URI using the custom scheme
  const redirectUri = "carbcounter://redirect"; // Replace with your custom scheme

  console.log("Redirect URI:", redirectUri); // Log the URI to verify

  // Create the authorization request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Exc6hrFQoZtwuSwD5i3OWHt1LuGLuQ47', // Replace with your Dexcom client ID
      scopes: ['offline_access'],
      redirectUri: redirectUri,
    },
    discovery
  );

  // Handle the OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('Authorization code:', code);
      exchangeCodeForToken(code); // Call the token exchange function when we get the code
    }
  }, [response]);

  // Exchange code for token using your Flask backend
  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch('/exchange-code', {  // Replace with your Flask server URL
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

  // Fetch glucose data using the stored access token
  const fetchGlucoseData = async () => {
    try {
      const storedAuthState = await SecureStore.getItemAsync('dexcomAuthState');
      const authState = JSON.parse(storedAuthState);

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

  // Logout by deleting the stored access token
  const dexcomLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('dexcomAuthState');
      console.log('Logged out');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Return the JSX for the Dexcom login, data fetching, and logout buttons
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
