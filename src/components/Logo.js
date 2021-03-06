import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import colors from "../theme/Colors";

export default class Bubble extends React.Component {
  render() {
    return (
      <Image
        style={Styles.logoContainer}
        resizeMode={"contain"}
        source={require("../assets/logo.png")}
      />
    );
  }
}
const Styles = StyleSheet.create({
  logoContainer: {
    position: "absolute",
    width: 80,
    height: 40,
    top: 40,
    alignItems: "center"
  }
});
