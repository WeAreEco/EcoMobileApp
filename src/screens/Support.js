import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import MyIframe from "../components/MyIframe";

const subTabs = [
  {
    title: "My Tickets",
    img: require("../assets/Landing/blogging.png"),
    page: "tickets",
  },
  {
    title: "Concierge",
    img: require("../assets/Landing/blogging.png"),
    page: "concierge",
  },
  {
    title: "New Chat",
    img: require("../assets/Landing/blogging.png"),
    page: "support",
  },
];
const Support = () => {
  const profile = useSelector((state) => state.profile);
  return (
    <MyIframe url={`https://uhsm.org?uid=${profile.id}`} subTabs={subTabs} />
  );
};
export default Support;
