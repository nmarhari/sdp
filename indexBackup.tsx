import React, { useState, useRef, useEffect } from "react";
import { Alert, Dimensions, Modal, Text, View } from "react-native";
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from '@/components/camera';
import { retrieveUser, insertCarbRatio, insertDexComLogin, retrieveTargetGlucose } from "@/reuseableFunctions/dbInit";
import { useDexcomAuth, fetchGlucoseData } from '../../reuseableFunctions/loginFunctions'; // Import Dexcom functions
import { useDatabase,  } from '../../reuseableFunctions/DatabaseContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Home = () => {
  const { request, promptAsync, authCode, error } = useDexcomAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [hasGlucoseRatio, setHasGlucoseRatio] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [glucoseLevel, setGlucoseLevel] = useState('');
  const photoPickerRef = useRef<any>(null);
  const db = useDatabase();
  const handleLogin = () => {
    if (request) {
      promptAsync();
    } else {
      Alert.alert("Login request is not ready");
    }
  };

  const handleCamera = () => {
    setIsCameraOpen(true);
  };

  const handleSetTargetLevels = () => {
    setIsModalVisible(true);
  };

  const handleSaveGlucoseLevel = () => {
    if (glucoseLevel) {
      insertCarbRatio(glucoseLevel)
        .then(() => {
          console.log("Carb-to-insulin ratio saved:", glucoseLevel);
          setIsModalVisible(false); // Close the modal after saving
          setIsUserLoggedIn(true); // Update login status if needed
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

  useEffect(() => {
    retrieveUser().then(d => {
      setIsUserLoggedIn(d.dexcom_login != null);
      setHasGlucoseRatio(d.carb_to_insulin_ratio != null);
    });
  }, []);

  return (
    <Container>
      <CameraContainer>
        <CameraPlaceholder>
          <Icon name="camera" size={screenWidth * 0.2} color="#6b6b6b" onPress={handleCamera}/>
        </CameraPlaceholder>
      </CameraContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Enter Target Glucose Level</ModalTitle>
            <Input
              placeholder="Glucose Level"
              keyboardType="numeric"
              value={glucoseLevel}
              onChangeText={setGlucoseLevel}
            />
            <SaveButton onPress={handleSaveGlucoseLevel}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ModalView>
        </ModalContainer>
      </Modal>

      <ButtonContainer>
        {!isUserLoggedIn && (
          <Button onPress={handleLogin}>
            <Icon name="user" size={20} color="#ffffff" />
            <ButtonText>LOGIN TO DEXCOM</ButtonText>
          </Button>
        )}
        
        {!hasGlucoseRatio && (
          <Button secondary onPress={handleSetTargetLevels}>
            <Icon name="sliders" size={20} color="#ffffff" />
            <ButtonText>SET TARGET GLUCOSE LEVELS</ButtonText>
          </Button>
        )}
      </ButtonContainer>

      {isCameraOpen && (
        <FullScreenCamera>
          <Camera onClose={() => setIsCameraOpen(false)} />
        </FullScreenCamera>
      )}

      {authCode && <Text>Authorization Code: {authCode}</Text>}
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

export default Home;
