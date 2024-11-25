import React, { useState } from "react";
import { Alert, Modal, Text, TextInput, View } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { insertGlucoseTarget, insertCarbRatio, insertDexComLogin, exportTableAsCSV } from "@/reuseableFunctions/dbInit";
import { useDexcomAuth, fetchGlucoseData } from "@/reuseableFunctions/loginFunctions";

const SettingsPage = () => {
  const { request, promptAsync, authCode, error } = useDexcomAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGlucoseModalVisible, setIsGlucoseModalVisible] = useState(false);
  const [isCarbModalVisible, setIsCarbModalVisible] = useState(false);
  const [newGlucoseTarget, setNewGlucoseTarget] = useState("");
  const [newCarbRatio, setNewCarbRatio] = useState("");

  const handleLogin = async () => {
    try {
      if (!request) {
        Alert.alert("Error", "Login request is not ready.");
        return;
      }
  
      // Prompt the user to log in
      const result = await promptAsync();
  
      if (result.type === "success") {
        // After successful login, retrieve and load user data
        Alert.alert("Success", "You are now logged in!");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login.");
    }
  };
  
  const handleResetGlucoseTarget = () => {
    setNewGlucoseTarget("");
    setIsGlucoseModalVisible(true);
  };

  const handleSaveGlucoseTarget = () => {
    if (newGlucoseTarget) {
      insertGlucoseTarget(parseInt(newGlucoseTarget))
        .then(() => {
          setIsGlucoseModalVisible(false);
          Alert.alert("Success", "New glucose target has been saved.");
        })
        .catch((error) => {
          console.error("Error saving glucose target:", error);
          Alert.alert("Error", "Failed to save glucose target.");
        });
    } else {
      Alert.alert("Input Required", "Please enter a valid glucose target.");
    }
  };

  const handleResetCarbRatio = () => {
    setNewCarbRatio("");
    setIsCarbModalVisible(true);
  };

  const handleSaveCarbRatio = () => {
    if (newCarbRatio) {
      insertCarbRatio(parseFloat(newCarbRatio))
        .then(() => {
          setIsCarbModalVisible(false);
          Alert.alert("Success", "New carb-to-insulin ratio has been saved.");
        })
        .catch((error) => {
          console.error("Error saving carb ratio:", error);
          Alert.alert("Error", "Failed to save carb ratio.");
        });
    } else {
      Alert.alert("Input Required", "Please enter a valid carb-to-insulin ratio.");
    }
  };

  const handleExportMealData = () => {
    exportMealData()
      .then((filePath) => {
        Alert.alert("Success", `Meal data exported to: ${filePath}`);
      })
      .catch((error) => {
        console.error("Export error:", error);
        Alert.alert("Error", "Failed to export meal data.");
      });
  };

  const handleLogout = () => {
    insertDexComLogin(null)
      .then(() => {
        Alert.alert("Success", "You have been logged out.");
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Logout error:", error);
        Alert.alert("Error", "Failed to log out.");
      });
  };

  return (
    <Container>
      <Header>
        <Icon name="cogs" size={50} color="#6b6b6b" />
        <Title>Settings</Title>
      </Header>

      <ButtonContainer>
        <Button onPress={handleLogin}>
          <ButtonText>LOGIN</ButtonText>
        </Button>
        <Button onPress={handleResetGlucoseTarget}>
          <ButtonText>RESET GLUCOSE TARGET LEVEL</ButtonText>
        </Button>
        <Button onPress={handleResetCarbRatio}>
          <ButtonText>RESET CARB RATIO</ButtonText>
        </Button>
        <Button onPress={handleExportMealData}>
          <ButtonText>EXPORT MEAL DATA</ButtonText>
        </Button>
        <Button onPress={handleLogout}>
          <ButtonText>LOGOUT</ButtonText>
        </Button>
      </ButtonContainer>

      {/* Modal for Glucose Target */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGlucoseModalVisible}
        onRequestClose={() => setIsGlucoseModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Enter New Glucose Target</ModalTitle>
            <Input
              placeholder="New Glucose Target"
              keyboardType="numeric"
              value={newGlucoseTarget}
              onChangeText={setNewGlucoseTarget}
            />
            <SaveButton onPress={handleSaveGlucoseTarget}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ModalView>
        </ModalContainer>
      </Modal>

      {/* Modal for Carb Ratio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCarbModalVisible}
        onRequestClose={() => setIsCarbModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Enter New Carb Ratio</ModalTitle>
            <Input
              placeholder="New Carb Ratio"
              keyboardType="numeric"
              value={newCarbRatio}
              onChangeText={setNewCarbRatio}
            />
            <SaveButton onPress={handleSaveCarbRatio}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ModalView>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
`;

const Header = styled.View`
  margin-top: 20px;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-top: 10px;
`;

const ButtonContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  background-color: #333;
  padding: 15px 25px;
  margin-vertical: 10px;
  border-radius: 10px;
  width: 80%;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px;
  background-color: #14ae5c;
`;

const FooterIcon = styled.View`
  align-items: center;
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

export default SettingsPage;
