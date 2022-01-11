/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState,
} from "react-native";

import { AsyncStorage } from "@react-native-community/async-storage";

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
// import OneSignal from "react-native-onesignal";
import store from "./src/Redux";
import LogoScreen from "./src/screens/LogoScreen";
import AppContainer from "./route";
import Landing from "./src/screens/Landing";
import SignIn from "./src/screens/SignIn/SignIn";
import PhoneCode from "./src/screens/SignIn/PhoneCode";
import IntroOne from "./src/screens/Intro/IntroOne";
import IntroTwo from "./src/screens/Intro/IntroTwo";
import IntroThree from "./src/screens/Intro/IntroThree";
import IntroFour from "./src/screens/Intro/IntroFour";
import Onboard from "./src/screens/Intro/Onboard";

import Firebase from "./src/firebasehelper";
import "./src/utils/fixtimerbug";

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    // Remove this method to stop OneSignal Debugging
    // OneSignal.setLogLevel(6, 0);
    // OneSignal.init("8beab5b1-a6ac-4560-aad6-fada11e503a9", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});

    // OneSignal.addEventListener("received", this.onReceived);
    // OneSignal.addEventListener("opened", this.onOpened);
    // OneSignal.addEventListener("ids", this.onIds);
    // OneSignal.configure();
  }
  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }
  onReceived(notification) {
    console.log("Notification received: ", notification);
  }
  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

  onIds(device) {
    console.log("Device info: ", device);
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);

    // OneSignal.removeEventListener("received", this.onReceived);
    // OneSignal.removeEventListener("opened", this.onOpened);
    // OneSignal.removeEventListener("ids", this.onIds);
  }

  handleAppStateChange = async (nextAppState) => {
    let uid = await AsyncStorage.getItem("uid");
    if (nextAppState === "inactive") {
      if (uid) {
        Firebase.updateUserData(uid, { app_opened: false });
      }
    }
    if (nextAppState === "active") {
      if (uid) {
        Firebase.updateUserData(uid, { app_opened: true });
      }
    }
  };

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            <Stack.Screen
              name="Logo"
              component={LogoScreen}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="Main"
              component={AppContainer}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="Landing"
              component={Landing}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="PhoneCode"
              component={PhoneCode}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="Onboard"
              component={Onboard}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="IntroOne"
              component={IntroOne}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="IntroTwo"
              component={IntroTwo}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="IntroThree"
              component={IntroThree}
              options={{ headerVisible: false }}
            />
            <Stack.Screen
              name="IntroFour"
              component={IntroFour}
              options={{ headerVisible: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

// export default StackNavigator;

const Styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
