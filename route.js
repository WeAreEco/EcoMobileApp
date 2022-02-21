import React, { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import Social from "./src/screens/Social";
import Shop from "./src/screens/Shop";
import Support from "./src/screens/Support";
import MyIframe from "./src/components/MyIframe";

import colors from "./src/theme/Colors";

const iconExplore = require("./src/assets/routing/white_explore.png");
const iconSocial = require("./src/assets/routing/white_social.png");
const iconShop = require("./src/assets/routing/white_shop.png");
const iconWallet = require("./src/assets/routing/white_wallet.png");
const iconiD = require("./src/assets/routing/white_iD.png");
const iconSupport = require("./src/assets/routing/white_support.png");

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
  const brand = useSelector((state) => state.brand);
  return profile ? (
    <Tab.Navigator
      initialRouteName="Explore"
      tabBarPosition="bottom"
      tabBarOptions={{
        showLabel: true,
        activeTintColor: "#FFFFFF",
        style: {
          backgroundColor: brand.hex || "#FFFFFF",
          color: "white",
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
      screenOptions={({ route }) => ({
        tabBarButton:
          route.name === "Explore"
            ? () => {
                return null;
              }
            : undefined,
      })}
    >
      <Tab.Screen
        name="Explore"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=explore&uid=${profile.id}`}
            {...props}
          />
        )}
      />
      <Tab.Screen
        name="Feeds"
        component={Social}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: "white",
                fontSize: 11,
                fontWeight: focused ? "500" : "200",
              }}
            >
              Explore
            </Text>
          ),
          tabBarIcon: () => (
            <Image source={iconExplore} style={styles.exploreIcon} />
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
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: focused ? 13 : 11 }}>
              iD
            </Text>
          ),
          tabBarIcon: () => <Image source={iconiD} style={styles.tabBarIcon} />,
        }}
      />
      <Tab.Screen
        name="Refund"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=sector-concierge&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: focused ? 13 : 11 }}>
              Refund
            </Text>
          ),
          tabBarIcon: () => (
            <Image source={iconSupport} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Earn"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=earn&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: focused ? 13 : 11 }}>
              Earn
            </Text>
          ),
          tabBarIcon: () => (
            <Image source={iconSocial} style={styles.tabBarIcon} />
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
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: focused ? 13 : 11 }}>
              Wallet
            </Text>
          ),
          tabBarIcon: () => (
            <Image source={iconWallet} style={styles.tabBarIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=ecopay&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: "white", fontSize: focused ? 13 : 11 }}>
              Shop
            </Text>
          ),
          tabBarIcon: () => (
            <Image source={iconShop} style={styles.tabBarIcon} />
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
  exploreIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});

export default AppContainer;
