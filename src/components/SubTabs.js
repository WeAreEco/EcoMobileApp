import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  FlatList,
} from "react-native";
import IconMenu from "./IconMenu";

const SubTabs = ({ tabs }) => {
  const navigation = useNavigation();
  const renderItem = ({ item, index }) => {
    return (
      <IconMenu
        data={item}
        key={index}
        PressItem={() => {
          const { page } = item;
        }}
        selected={0}
        position={index}
      />
    );
  };
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FlatList
        contentContainerStyle={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          width: "100%",
          padding: 5,
        }}
        data={tabs}
        renderItem={renderItem}
        horizontal={true}
        keyExtractor={(item, index) => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    textAlign: "center",
    fontSize: 17,
  },
  activeText: {
    fontWeight: "600",
  },
  active: {
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  inactive: {
    color: "grey",
  },
});
export default SubTabs;
