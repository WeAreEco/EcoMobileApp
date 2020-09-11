import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import colors from "../theme/Colors";

export default class Caption extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { content } = this.props;
    return (
      <Text
        style={{
          width: 280,
          textAlign: "center",
          marginBottom: 20
        }}
      >
        {content}
      </Text>
    );
  }
}
