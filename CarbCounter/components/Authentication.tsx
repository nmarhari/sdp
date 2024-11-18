import React, { useEffect, useState } from 'react';
import { Button, View, Text, Alert, Modal, Dimensions} from 'react-native';  // Make sure to import Text
import AsyncStorage from '@react-native-async-storage/async-storage'; // Replacing SecureStore with AsyncStorage
import { useAuthRequest } from 'expo-auth-session';
import { Linking } from 'react-native';
import { updateCarbRatio } from "@/reuseableFunctions/dbInit";
import styled from 'styled-components/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");


// Dexcom OAuth endpoints
const discovery = {
  authorizationEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/login',
  tokenEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/token',
};

export default function DexcomLogin() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [authCode, setAuthCode] = useState(null);
  const [error, setError] = useState(null);
  const [glucoseRatio, setGlucoseRatio] = useState('');

  const handleSetGlucoseRatio = () => {
    setIsModalVisible(true);
  };


  // Redirect URI (using localhost for now)
  const redirectUri = 'CarbCounter://*';  // Replace with your localhost URL

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
    if (response?.type === 'success'){
      const { code } = response.params;
      setAuthCode(code);
      exchangeCodeForToken(code);
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
  
  const fetchGlucoseData = async () => {
    try {
        const storedAuthState = await AsyncStorage.getItem('dexcomAuthState');
        if (!storedAuthState) throw new Error('Please log in again.');
        
        const { access_token } = JSON.parse(storedAuthState);
        const response = await fetch('/fetch-glucose-data', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        console.log('Glucose Data:', await response.json());
        
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

  const modifyGlucoseRatio = () => {
    if (glucoseRatio) {
      console.log(glucoseRatio);
      updateCarbRatio(glucoseRatio)
        .then(() => {
          console.log("Carb-to-insulin ratio saved:", glucoseRatio);
          setIsModalVisible(false);
          Alert.alert("Success", "Carb-to-insulin ratio saved successfully!");
        })
        .catch(error => {
          console.error("Error saving carb-to-insulin ratio:", error);
          Alert.alert("Error", "Failed to save carb-to-insulin ratio.");
        });
    } else {
      Alert.alert("Input Required", "Please enter a valid glucose level.");
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
      <Button title="Change Carb Ratio" secondary onPress={handleSetGlucoseRatio}>
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Enter Glucose Ratio</ModalTitle>
            <Input
              placeholder="Glucose Level"
              keyboardType="numeric"
              value={glucoseRatio}
              onChangeText={setGlucoseRatio}
            />
            <SaveButton onPress={modifyGlucoseRatio}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ModalView>
        </ModalContainer>
      </Modal>

      <Button title="Logout" onPress={dexcomLogout} />

      {/* Display authorization code if available */}
      {authCode && <Text>Authorization Code: {authCode}</Text>}
      
      {/* Display errors if any */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
}

// Styled Components
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: ${screenHeight * 0.05}px ${screenWidth * 0.05}px;
`;

const CameraContainer = styled.View`
  flex: 2;
  justify-content: center;
  align-items: center;
`;

const CameraPlaceholder = styled.View`
  width: ${screenWidth * 0.4}px;
  height: ${screenWidth * 0.4}px;
  border-radius: ${screenWidth * 0.2}px;
  background-color: #e0e0e0;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: space-around;
`;


const ButtonText = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: #ffffff;
  font-weight: bold;
  margin-left: ${screenWidth * 0.02}px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalView = styled.View`
  width: 80%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: #ccc;
  border-width: 1px;
  border-radius: 5px;
  padding-horizontal: 10px;
  width: 100%;
  margin-bottom: 15px;
`;

const SaveButton = styled.TouchableOpacity`
  padding: 10px;
  background-color: #007aff;
  border-radius: 5px;
  width: 100%;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  color: #ffffff;
  font-weight: bold;
`;

const FullScreenCamera = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
