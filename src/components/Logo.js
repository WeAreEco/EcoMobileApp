import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../theme/Colors";

export default class Bubble extends React.Component {
  render() {
    return (
      <Image
        style={Styles.logoContainer}
        resizeMode={"stretch"}
        source={require("../assets/uhsm_main_logo.jpeg")}
      />
    );
  }
}
const Styles = StyleSheet.create({
  logoContainer: {
    position: "absolute",
    top: 50,
    width: 80,
    height: 80,
  },
});
