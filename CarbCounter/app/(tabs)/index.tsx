import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import Svg, { Ellipse } from "react-native-svg";

// Get the screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Home: React.VFC = () => {
  return (
    <iPhone14&15ProMax-HomeScreen>
      <Component1>
        <Maskgroup>
          <Rectangle2 />
          <...Text> . . .</...Text>
          <Line1 />
        </Maskgroup>
      </Component1>
      <Button>
        <UserImage />
        <ButtonText>LOGIN TO DEXCOM</ButtonText>
      </Button>
      <Button>
        <SlidersImage />
        <ButtonText>SET TARGET GLUCOSE LEVELS</ButtonText>
      </Button>
      <CameraHome>
        <CameraImage />
        <Ellipse3 />
        <Ellipse3 />
        <Ellipse3 />
        <Ellipse3 />
        <Ellipse3 />
        <Ellipse3 />
        <Ellipse4 />
        <Rectangle3 />
        <Ellipse5 />
        <Ellipse6 />
        <Ellipse7 />
        <Ellipse8 />
        <Rectangle5 />
        <Rectangle6 />
        <Ellipse9 />
        <Ellipse10 />
      </CameraHome>
      <Cameraflash>
        <CaptureText> </CaptureText>
      </Cameraflash>
    </iPhone14&15ProMax-HomeScreen>
  )
}

const iPhone14&15ProMax-HomeScreen = styled.View`
  height: 932px;
  width: 430px;
  background-color: #ffffff;
`
const Component1 = styled.View`
  height: 75px;
  width: 49px;
  background-color: #ffffff;
`
const Maskgroup = styled.View`
  height: 75px;
  width: 4px;
`
const Rectangle2 = styled.View`
  height: 75px;
  width: 4px;
  background-color: #d9d9d9;
  border: 1px solid #000000;
`
const ...Text = styled.Text`
  max-width: 163px;
  text-align: left;
  vertical-align: top;
  font-family: Average;
  font-weight: regular;
  font-size: 70px;
  letter-spacing: -4%;
  line-height: auto;
  color: #000000;
`
const Line1 = styled.View`
  transform: rotate(-90deg);
  height: 0px;
  width: 60px;
  border: 1px solid #000000;
`
const Button = styled.View`
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 12px 48px;
  background-color: #14ae5c;
  border: 1px solid #2c2c2c;
`
const UserImage = styled.View`
  height: 16px;
  width: 16px;
  background-color: #ffffff;
`
const ButtonText = styled.Text`
  max-width: 204px;
  text-align: center;
  vertical-align: middle;
  font-family: Inter;
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  color: #ffffff;
`
const SlidersImage = styled.View`
  height: 16px;
  width: 16px;
  background-color: #ffffff;
`
const CameraHome = styled.View`
  transform: rotate(0deg);
  height: 99px;
  width: 113px;
`
const CameraImage = styled.View`
  transform: rotate(0deg);
  height: 97px;
  width: 111px;
  background-color: #ffffff;
`
const Ellipse3 = styled.View`
  transform: rotate(0deg);
  height: 13px;
  width: 21px;
`
const Ellipse4 = styled.View`
  transform: rotate(0deg);
  height: 5px;
  width: 6px;
`
const Rectangle3 = styled.View`
  transform: rotate(0deg);
  height: 6px;
  width: 14px;
  background-color: #b33535;
`
const Ellipse5 = styled.View`
  transform: rotate(0deg);
  height: 38px;
  width: 41px;
`
const Ellipse6 = styled.View`
  transform: rotate(0deg);
  height: 37px;
  width: 39px;
`
const Ellipse7 = styled.View`
  opacity: 0.6000000238418579;
  transform: rotate(0deg);
  height: 34px;
  width: 37px;
`
const Ellipse8 = styled.View`
  opacity: 0.10000000149011612;
  transform: rotate(-39deg);
  height: 28px;
  width: 29px;
`
const Rectangle5 = styled.View`
  opacity: 0.4000000059604645;
  transform: rotate(-1deg);
  height: 5px;
  width: 5px;
  background-color: #d9d9d9;
`
const Rectangle6 = styled.View`
  opacity: 0.4000000059604645;
  transform: rotate(33deg);
  height: 5px;
  width: 5px;
  background-color: #ffffff;
`
const Ellipse9 = styled.View`
  transform: rotate(0deg);
  height: 20px;
  width: 21px;
`
const Ellipse10 = styled.View`
  opacity: 0.5;
  transform: rotate(0deg);
  height: 7px;
  width: 8px;
`
const Cameraflash = styled.View`
  height: 322px;
  width: 458px;
`
const CaptureText = styled.Text`
  max-width: 230px;
  text-align: left;
  vertical-align: top;
  font-family: Average;
  font-weight: regular;
  font-size: 70px;
  letter-spacing: -4%;
  line-height: auto;
  color: #000000;
`
export default Home;
