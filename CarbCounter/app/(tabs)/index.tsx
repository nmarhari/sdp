import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import Svg, { Ellipse } from "react-native-svg";

// Get the screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

function Home(props) {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.bloodGlucoseRow}>
          <Text style={styles.bloodGlucose}>Blood Glucose</Text>
          <View style={styles.ellipseStack}>
            <Svg viewBox="0 0 43.08 39.91" style={styles.ellipse}>
              <Ellipse
                stroke="rgba(230, 230, 230,1)"
                strokeWidth={0}
                fill="rgba(230, 230, 230,1)"
                cx={22}
                cy={20}
                rx={22}
                ry={20}
              ></Ellipse>
            </Svg>
            <Text style={styles.h2}>H</Text>
          </View>
        </View>
        <View style={styles.normalRow}>
          <Text style={styles.normal}>Normal</Text>
          <Text style={styles.current}>Current</Text>
        </View>
        <View style={styles.norStackStack}>
          <View style={styles.norStack}>
            <Text style={styles.nor}>70</Text>
            <Text style={styles.mg}>mg</Text>
            <Image
              source={require("@/assets/images/4.jpg")}
              resizeMode="contain"
              style={styles.image}
            ></Image>
          </View>
          <View style={styles.loremIpsumStack}>
            <Text style={styles.loremIpsum}>80</Text>
            <Text style={styles.mg2}>mg</Text>
          </View>
        </View>
      </View>
      <View style={styles.rect}>
        <Text style={styles.takePhoto}>Take Photo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  background: {
    width: screenWidth,  // Set to screen width dynamically
    height: screenHeight * 0.65,  // 65% of screen height
    backgroundColor: "rgba(87,87,89,1)",
    marginTop: screenHeight * 0.05  // Adjust margin relative to screen height
  },
  bloodGlucose: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 30
  },
  ellipse: {
    top: 0,
    left: 0,
    width: 43,
    height: 40,
    position: "absolute"
  },
  h2: {
    top: 7,
    left: 10,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(189,16,224,1)",
    height: 25,
    width: 24,
    textAlign: "center",
    fontSize: 20
  },
  ellipseStack: {
    width: 43,
    height: 40,
    marginLeft: 37,
    marginTop: 6
  },
  bloodGlucoseRow: {
    height: 46,
    flexDirection: "row",
    marginLeft: screenWidth * 0.24,  // Adjusted relative to screen width
    marginRight: screenWidth * 0.02  // Adjusted relative to screen width
  },
  normal: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    height: 17,
    width: 46,
    fontSize: 14
  },
  current: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    marginLeft: screenWidth * 0.62  // Adjusted relative to screen width
  },
  normalRow: {
    height: 17,
    flexDirection: "row",
    marginTop: 19,
    marginLeft: 20,
    marginRight: 29
  },
  nor: {
    top: 0,
    left: 20,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 80,
    height: 96,
    width: 90
  },
  mg: {
    top: 93,
    left: 107,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  image: {
    top: 96,
    left: 0,
    width: screenWidth,  // Adjusted to fit the screen width
    height: screenHeight * 0.5,  // Adjusted to 50% of screen height
    position: "absolute"
  },
  norStack: {
    top: 0,
    left: 0,
    width: screenWidth,  // Adjusted to screen width
    height: screenHeight * 0.65,  // Adjusted to 65% of screen height
    position: "absolute"
  },
  loremIpsum: {
    top: 0,
    left: 0,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(208,87,2,1)",
    fontSize: 80
  },
  mg2: {
    top: 93,
    left: 86,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  loremIpsumStack: {
    top: 0,
    left: screenWidth * 0.68,  // Adjusted relative to screen width
    width: 106,
    height: 110,
    position: "absolute"
  },
  norStackStack: {
    width: screenWidth,  // Adjusted to screen width
    height: screenHeight * 0.65,  // Adjusted to 65% of screen height
    marginTop: 13
  },
  rect: {
    width: screenWidth * 0.63,  // Adjusted relative to screen width
    height: screenHeight * 0.1,  // Adjusted relative to screen height
    backgroundColor: "rgba(22,216,205,1)",
    borderRadius: 100,
    marginTop: 17,
    marginLeft: screenWidth * 0.18  // Adjusted relative to screen width
  },
  takePhoto: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    height: 53,
    width: 139,
    textAlign: "center",
    fontSize: 27,
    marginTop: 25,
    marginLeft: 51
  }
});

export default Home;