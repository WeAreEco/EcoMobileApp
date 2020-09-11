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
import { CheckBox } from "react-native-elements";

export default class CheckDiv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }
  // componentWillReceiveProps = props => {
  //   this.setState({ checked: props.checked });
  // };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checked) {
      return ({ checked: nextProps.checked }) // <- this is setState equivalent
    }
    return null
  }

  render() {
    //const { checked } = this.state;
    const { title, onCheck, checked } = this.props;
    return (
      <CheckBox
        center
        title={title}
        checked={checked}
        onIconPress={onCheck}
        checkedColor={colors.darkblue}
        uncheckedColor={colors.darkblue}
        fontFamily="Gothic A1"
        containerStyle={{
          backgroundColor: "transparent",
          borderWidth: 0,
          margin: 0
        }}
      />
    );
  }
}
