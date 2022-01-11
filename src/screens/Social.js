import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import MyIframe from "../components/MyIframe";

const Stack = createStackNavigator();
const subTabs = [
  { title: "Forum", img: require("../assets/Landing/blogging.png") },
  { title: "Hot", img: require("../assets/Landing/blogging.png") },
  { title: "Articles", img: require("../assets/Landing/blogging.png") },
  { title: "Polls", img: require("../assets/Landing/blogging.png") },
  { title: "Events", img: require("../assets/Landing/blogging.png") },
];

const Social = () => {
  const profile = useSelector((state) => state.profile);
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="Forum"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=feeds&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{ headerVisible: false }}
      />
      <Stack.Screen
        name="Hot"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=feeds&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{ headerVisible: false }}
      />
      <Stack.Screen
        name="Articles"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=feeds&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{ headerVisible: false }}
      />
      <Stack.Screen
        name="Polls"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=polls&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{ headerVisible: false }}
      />
      <Stack.Screen
        name="Events"
        children={(props) => (
          <MyIframe
            url={`https://uhsm.org?page=polls&uid=${profile.id}`}
            {...props}
          />
        )}
        options={{ headerVisible: false }}
      />
    </Stack.Navigator>
  );
};
export default Social;
