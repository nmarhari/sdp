import React, { useState, useRef, useEffect } from "react";
import { Alert, Dimensions, Modal, Text, View } from "react-native";
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from '@/components/camera';
import { retrieveUser, insertCarbRatio, insertDexComLogin, retrieveTargetGlucose, insertMeal, insertGlucoseTarget } from "@/reuseableFunctions/dbInit";
import { useDexcomAuth, fetchGlucoseData } from '../../reuseableFunctions/loginFunctions';
import { useDatabase } from '../../reuseableFunctions/DatabaseContext';
import { LineChart } from 'react-native-gifted-charts';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Home = () => {
  let lowerLimit, upperLimit
  const { request, promptAsync, authCode, error } = useDexcomAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [hasGlucoseTarget, setHasGlucoseTarget] = useState(false);
  const [hasCarbRatio, setHasCarbRatio] = useState(false);
  const [targetGlucose, setTargetGlucose] = useState(null);
  const [glucoseData, setGlucoseData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTargetModalVisible, setIsTargetModalVisible] = useState(false);
  const [glucoseTarget, setGlucoseTarget] = useState('');
  const [carbRatio, setGlucoseLevel] = useState('');
  const photoPickerRef = useRef(null);
  const [isMealModalVisible, setIsMealModalVisible] = useState(false);
  const [carbAmount, setCarbAmount] = useState(0);
  const [calculatedInsulin, setCalculatedInsulin] = useState(0);

  const db = useDatabase();

  const handleCarbsDetected = (carbs) => {
    console.log(carbs);
    setIsCameraOpen(false);
    setCarbAmount(JSON.parse(carbs.replace(/'/g, '"')).carbs);
    setIsMealModalVisible(true);
  }
  const handleLogin = () => {
    if (request) {
      promptAsync().then(loadData);
      setIsUserLoggedIn(true);
    } else {
      Alert.alert("Login request is not ready");
    }
  };

  const handleCamera = () => {
    setIsCameraOpen(true);
  };

  const handleSetCarbRatio = () => {
    setIsModalVisible(true);
  };

  const handleSaveCarbRatio = () => {
    if (carbRatio) {
      insertCarbRatio(carbRatio)
        .then(() => {
          console.log("Carb-to-insulin ratio saved:", carbRatio);
          setIsModalVisible(false);
          setHasCarbRatio(true);
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
const handleSetGlucoseTarget = () => { 
  setIsTargetModalVisible(true);
}

const handleSaveGlucoseTarget = () => {
    if (glucoseTarget) {
      insertGlucoseTarget(glucoseTarget)
        .then(() => {
          console.log("Glucose Target saved:", glucoseTarget);
          setIsTargetModalVisible(false);
          setHasGlucoseTarget(true);
          Alert.alert("Success", "Glucose Target saved successfully!");
        })
        .catch(error => {
          console.error("Error saving Glucose Target:", error);
          Alert.alert("Error", "Failed to save Glucose Target.");
        });
    } else {
      Alert.alert("Input Required", "Please enter a valid glucose target.");
    }
  };  
  // Fetch target glucose and glucose data on page load
  useEffect(() => {
    loadData();
  }, [isUserLoggedIn]);

  useEffect(()=> {}, [isUserLoggedIn])
  async function loadData() {
    try {
      const user = await retrieveUser();
      setIsUserLoggedIn(user.dexcom_login != null);
      setHasCarbRatio(user.carb_to_insulin_ratio != null);
      setHasGlucoseTarget(user.glucose_target != null);
      const target = await retrieveTargetGlucose();
      setTargetGlucose(target);

      const data = await fetchGlucoseData();
      lowerLimit = target ? target - 30 : 90;
      upperLimit = target ? target + 30 : 150;
    
      if (data && data.egvs && Array.isArray(data.egvs)) {
        const validEgvs = data.egvs.filter(item => item.value !== null && !isNaN(item.value));
        
        const formattedData = validEgvs.map((item, index) => ({
          value: item.value, // Use only valid values
          label: `T${index}: ${item.displayTime || "Unknown Time"}`, // Provide default label
        }));
      
        setGlucoseData(formattedData);
      } else {
        console.error("Invalid egvs data:");
      }

    } catch (err) {
      console.log("Failed to load data:", err);
    }
  }
  
  const handleSaveMeal = (carbs, glucose, insulin) => {
    const mealDetails = {
      time: new Date().toISOString(),
      meal: carbs,
      glucose,
      insulin,
    };
  
  insertMeal(mealDetails.time, mealDetails.meal, mealDetails.glucose, mealDetails.insulin)
      .then(() => {
        console.log("Meal saved successfully:", mealDetails);
        setIsMealModalVisible(false);
        Alert.alert("Success", "Meal details saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving meal:", error);
        Alert.alert("Error", "Failed to save meal details.");
      });
  };
  
  

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
          visible={isMealModalVisible}
          onRequestClose={() => setIsMealModalVisible(false)}
        >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Insulin Dosage Calculation</ModalTitle>
            <Text style={{ marginBottom: 10, fontSize: 16 }}>
              Detected Carbs: {carbAmount}g
            </Text>
            <Text style={{ marginBottom: 10, fontSize: 16 }}>
              Calculated Insulin: {carbAmount / carbRatio} units
            </Text>
            <SaveButton
              onPress={() =>
                handleSaveMeal(
                  carbAmount,
                  glucoseData[glucoseData.length - 1]?.value,
                  calculatedInsulin
                )
              }
            >
              <SaveButtonText>Save Meal</SaveButtonText>
            </SaveButton>
            <SaveButton
              style={{ backgroundColor: "#ccc", marginTop: 10 }}
              onPress={() => setIsMealModalVisible(false)}
            >
              <SaveButtonText>Cancel</SaveButtonText>
            </SaveButton>
          </ModalView>
        </ModalContainer>
      </Modal>




      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Enter Carb to Insulin Ratio</ModalTitle>
            <Input
              placeholder="Carb to Insulin Ratio"
              keyboardType="numeric"
              value={carbRatio}
              onChangeText={setGlucoseLevel}
            />
            <SaveButton onPress={handleSaveCarbRatio}>
              <SaveButtonText>Save</SaveButtonText>
            </SaveButton>
          </ModalView>
        </ModalContainer>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTargetModalVisible}
        onRequestClose={() => setIsTargetModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Enter Target Glucose Level</ModalTitle>
            <Input
              placeholder="Glucose Target"
              keyboardType="numeric"
              value={glucoseTarget}
              onChangeText={setGlucoseTarget}
            />
            <SaveButton onPress={handleSaveGlucoseTarget}>
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

        {!hasGlucoseTarget && (
          <Button secondary onPress={handleSetGlucoseTarget}>
            <Icon name="sliders" size={20} color="#ffffff" />
            <ButtonText>SET GLUCOSE TARGET LEVEL</ButtonText>
          </Button>
        )}

        {!hasCarbRatio && (
          <Button secondary onPress={handleSetCarbRatio}>
            <Icon name="sliders" size={20} color="#ffffff" />
            <ButtonText>SET INSULIN TO CARB RATIO</ButtonText>
          </Button>
        )}

      </ButtonContainer>

      {isCameraOpen && (
        <FullScreenCamera>
              <Camera 
              onClose={() => setIsCameraOpen(false)} 
              onCarbsDetected={handleCarbsDetected} 
            />
        </FullScreenCamera>
      )}


      {isUserLoggedIn && hasCarbRatio && glucoseData.length > 0 && !isCameraOpen && (
        <>
        {/* Display the newest data point */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>
          Current Glucose Level: {glucoseData[glucoseData.length - 1]?.value || 'N/A'}
        </Text>


        {/* Line chart container */}
        <View style={{ marginVertical: 20, padding: 10, backgroundColor: '#f8f9fa' }}>
          <LineChart
            data={glucoseData}
            width={screenWidth * 0.9}
            height={250}
            spacing={2.5}
            disableScroll={true}
            hideDataPoints
            areaChart
            showYAxisIndices={true}
            showXAxisIndices
            thickness={5}
            color={'green'}
            yAxisTextStyle={{ color: 'gray' }}
            xAxisTextStyle={{ color: 'gray' }}
            noOfSections={4}
            adjustToHeight
            rulesType="solid"
            rulesColor="#ddd"
            backgroundColor="white"
            yAxisOffset={10}
            hideAxesAndRules
            colorFill={['#a3e4a4']} // Green fill within limits
          />
        </View>
      </>
    )}
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