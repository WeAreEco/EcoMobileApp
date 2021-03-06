import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import { Image, StyleSheet } from "react-native";
import Concierge from "./src/screens/Concierge";
import EcoPay from "./src/screens/EcoPay";
import Diary from "./src/screens/Diary";
import Explore from "./src/screens/Explore";
import Profile from "./src/screens/Profile";
import Wallet from "./src/screens/Wallet";
// import MyHome from "./src/screens/MyHome";
import Connect from "./src/screens/Connect";
import colors from "./src/theme/Colors";

const iconExplore = require("./src/assets/routing/icon_explore.png");
const iconWallet = require("./src/assets/routing/icon_wallet.png");
const iconEcoPay = require("./src/assets/routing/icon_ecopay.png");
const iconConnect = require("./src/assets/routing/icon_connect.png");
const iconEcoID = require("./src/assets/routing/icon_ecoid.png");

// const AppContainer = NavigationContainer(
//   createBottomTabNavigator(routeConfigs, tabNavigatorConfig)
// );

const Tab = createBottomTabNavigator();

export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (

      <Tab.Navigator
        initialRouteName="Feed"
        tabBarPosition="bottom"
        tabBarOptions={{
          showLabel: true,
          activeTintColor: "#000000",
          style: {
            backgroundColor: '#FFFFFF',
            // height: 60,
            borderTopColor: 'transparent',
            shadowOffset: {
              height: 1,
              width: 1
            },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2,
            elevation: 3
          }
        }}
      >
        <Tab.Screen
          name="Explore"
          component={Explore}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: () => (
              <Image source={iconExplore} style={styles.tabBarIcon} />
            )
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={Wallet}
          options={{
            tabBarLabel: 'Wallet',
            tabBarIcon: () => (
              <Image source={iconWallet} style={styles.tabBarIcon} />
            )
          }}
        />
        <Tab.Screen
          name="EcoPay"
          component={EcoPay}
          options={{
            tabBarLabel: 'EcoPay',
            tabBarIcon: () => (
              <Image source={iconEcoPay} style={styles.tabBarIcon} />
            )
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              // Prevent default action
              e.preventDefault();

              // Do something with the `navigation` object
              navigation.navigate('EcoPay', { reset: true });
            },
          })}
        />
        <Tab.Screen
          name="Connect"
          component={Connect}
          options={{
            tabBarLabel: 'Connect',
            tabBarIcon: () => (
              <Image source={iconConnect} style={styles.tabBarIcon} />
            )
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'EcoID',
            tabBarIcon: () => (
              <Image source={iconEcoID} style={styles.tabBarIcon} />
            )
          }}
        />
      </Tab.Navigator>

    );
  }
}

const styles = StyleSheet.create({
  tabBarIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  }
})