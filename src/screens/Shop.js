import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import MyIframe from "../components/MyIframe";

const Stack = createStackNavigator();

const subTabs = [
  {
    title: "TokenPay",
    img: require("../assets/Landing/blogging.png"),
    page: "ecopay",
  },
  {
    title: "Store",
    img: require("../assets/Landing/blogging.png"),
    page: "shop",
  },
];
const Shop = () => {
  const profile = useSelector((state) => state.profile);
  return (
    <MyIframe url={`https://uhsm.org?uid=${profile.id}`} subTabs={subTabs} />
  );
};
export default Shop;
