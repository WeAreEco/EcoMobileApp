import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import MyIframe from "../components/MyIframe";

const subTabs = [
  {
    title: "Tickets",
    img: require("../assets/Landing/blogging.png"),
    page: "tickets",
  },
  {
    title: "LiveChat",
    img: require("../assets/Landing/blogging.png"),
    page: "support",
  },
];
const Support = () => {
  const profile = useSelector((state) => state.profile);
  return (
    <MyIframe
      url={`https://uhsm.org?page=support&uid=${profile.id}`}
      subTabs={subTabs}
    />
  );
};
export default Support;
