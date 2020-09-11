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

import Main from "./Main";
import LiveChat from "./LiveChat";
import TravelBooking from "./Travelbooking";

const Stack = createStackNavigator();

export default class Concierge extends Component {
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
            name="Main"
            component={Main}
            options={{ headerVisible: false }}
          />
          <Stack.Screen
            name="TravelBooking"
            component={TravelBooking}
            options={{ headerVisible: false }}
          />
        </Stack.Navigator>

    );
  }
}

// export default StackNavigator;
