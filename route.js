import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Social from "./src/screens/Social";
import Shop from "./src/screens/Shop";
import Support from "./src/screens/Support";
import MyIframe from "./src/components/MyIframe";

import colors from "./src/theme/Colors";

const iconExplore = require("./src/assets/routing/home.png");
const iconSocial = require("./src/assets/routing/social.png");
const iconShop = require("./src/assets/routing/shop.png");
const iconWallet = require("./src/assets/routing/wallet.png");
const iconiD = require("./src/assets/routing/iD.png");
const iconSupport = require("./src/assets/routing/support.png");

const walletTabs = [
  { title: "Tokens", img: require("./src/assets/Landing/blogging.png") },
  { title: "Wallets", img: require("./src/assets/Landing/blogging.png") },
];
const supportTabs = [
  { title: "Tickets", img: require("./src/assets/Landing/blogging.png") },
  { title: "LiveChat", img: require("./src/assets/Landing/blogging.png") },
];
const Tab = createBottomTabNavigator();

const AppContainer = () => {
  const profile = useSelector((state) => state.profile);
  return profile ? (
    <Tab.Navigator
      initialRouteName="Explore"
      tabBarPosition="bottom"
      tabBarOptions={{
        showLabel: true,
        activeTintColor: "#000000",
        style: {
          backgroundColor: "#FFFFFF",
          // height: 60,
          borderTopColor: "transparent",
          shadowOffset: {
            height: 1,
            width: 1,
          },
          shadowColor: colors.darkblue,
          shadowOpacity: 0.2,
          elevation: 3,
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=explore&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: () => (
            <Image source={iconExplore} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Social"
        component={Social}
        options={{
          tabBarLabel: "Social",
          tabBarIcon: () => (
            <Image source={iconSocial} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={Shop}
        options={{
          tabBarLabel: "Shop",
          tabBarIcon: () => (
            <Image source={iconShop} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=wallets&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{
          tabBarLabel: "Wallet",
          tabBarIcon: () => (
            <Image source={iconWallet} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="iD"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=profile&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{
          tabBarLabel: "iD",
          tabBarIcon: () => <Image source={iconiD} style={styles.tabBarIcon} />,
        }}
      />
      <Tab.Screen
        name="Support"
        component={Support}
        options={{
          tabBarLabel: "Support",
          tabBarIcon: () => (
            <Image source={iconSupport} style={styles.tabBarIcon} />
          ),
        }}
      />
    </Tab.Navigator>
  ) : null;
};

const styles = StyleSheet.create({
  tabBarIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
});

export default AppContainer;
