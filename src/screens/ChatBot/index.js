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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import Onboarding from "./Onboarding";
import InfoGuideHome from "./InfoGuideHome";

const Stack = createStackNavigator();

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let tabBarLabel = "Profile";
    let tabBarIcon = () => (
      <Image
        source={require("../../assets/profile.png")}
        style={{ width: 26, height: 26 }}
      />
    );
    return { tabBarLabel, tabBarIcon };
  };

  render() {
    return (

        <Stack.Navigator>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
          />
          <Stack.Screen
            name="InfoGuideHome"
            component={InfoGuideHome}
          />
        </Stack.Navigator>

    );
  }
}
