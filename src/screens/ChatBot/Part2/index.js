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

import Address from "./Address";
import Credit from "./Credit";
import Employed from "./Employed";
import SelfEmployed from "./SelfEmployed";
import Final from "./Final";

const Stack = createStackNavigator();

export default class Part2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (

        <Stack.Navigator
          headerMode="none"
        >
          <Stack.Screen
            name="Address"
            component={Address}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="Final"
            component={Final}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="SelfEmployed"
            component={SelfEmployed}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="Employed"
            component={Employed}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="Credit"
            component={Credit}
            options={{ headerVisible: false }}
          />
        </Stack.Navigator>

    );
  }
}
