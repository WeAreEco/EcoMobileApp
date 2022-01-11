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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Landing_New from "./Landing_New";
import Landing from "./Landing";
import Landing_Toggle from "./Landing_Toggle";
import Main from "./Main";
import Pack from "./Pack";
import DirectDebit from "./DirectDebitSetup";
import PaymentSetup from "./PaymentSetup";
import Forum from "./Forum";

const Stack = createStackNavigator();

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Forum"
          component={Forum}
          options={{ headerVisible: false }}
        />
        {/* <Stack.Screen
            name="LandNew"
            component={Landing_New}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="LandExplore"
            component={Landing}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="Toggle"
            component={Landing_Toggle}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="MainList"
            component={Main}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="Pack"
            component={Pack}
            options={{ headerVisible: false }}
          /> */}
      </Stack.Navigator>
    );
  }
}
