import React from 'react';
import { Alert, Dimensions, Text } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDexcomAuth, fetchGlucoseData } from '../../reuseableFunctions/loginFunctions'; // Import Dexcom functions
// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Home = () => {
  const { request, promptAsync, authCode, error } = useDexcomAuth();

  // Connect "LOGIN TO DEXCOM" button to Dexcom login
  const handleLogin = () => {
    if (request) {
      promptAsync();
    } else {
      Alert.alert("Login request is not ready");
    }
  };

  // Placeholder function for "SET TARGET GLUCOSE LEVELS" button
  const handleSetTargetLevels = () => {
    Alert.alert("Set Target Glucose Levels clicked");
  };

  return (
    <Container>
      <CameraContainer>
        <CameraPlaceholder>
          <Icon name="camera" size={screenWidth * 0.2} color="#6b6b6b" />
        </CameraPlaceholder>
      </CameraContainer>
      
      <ButtonContainer>
        <Button onPress={handleLogin}>
          <Icon name="user" size={20} color="#ffffff" />
          <ButtonText>LOGIN TO DEXCOM</ButtonText>
        </Button>
        
        <Button secondary onPress={handleSetTargetLevels}>
          <Icon name="sliders" size={20} color="#ffffff" />
          <ButtonText>SET TARGET GLUCOSE LEVELS</ButtonText>
        </Button>
      </ButtonContainer>

      {/* Display authorization code if available */}
      {authCode && <Text>Authorization Code: {authCode}</Text>}

      {/* Display errors if any */}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </Container>
  );
};

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

const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${screenHeight * 0.015}px;
  margin-vertical: ${screenHeight * 0.01}px;
  border-radius: ${screenWidth * 0.02}px;
  background-color: ${({ secondary }) => (secondary ? '#9e9e9e' : '#14ae5c')};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ButtonText = styled.Text`
  font-size: ${screenWidth * 0.045}px;
  color: #ffffff;
  font-weight: bold;
  margin-left: ${screenWidth * 0.02}px;
`;

export default Home;
