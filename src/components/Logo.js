import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

const Logo = () => (
  <Image
    style={Styles.logoContainer}
    resizeMode={"stretch"}
    source={require("../assets/uhsm_main_logo.jpeg")}
  />
);
const Styles = StyleSheet.create({
  logoContainer: {
    position: "absolute",
    top: 50,
    width: 80,
    height: 80,
  },
});
export default Logo;
