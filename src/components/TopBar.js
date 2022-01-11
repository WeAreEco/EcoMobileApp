import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { Menu, Divider, Provider, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import { removeAll } from "../Redux/actions";
import { Colors } from "../theme";
const TopBar = () => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  console.log("profile", profile);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const logOut = () => {
    dispatch(removeAll());
    closeMenu();
    AsyncStorage.removeItem("profile");
    AsyncStorage.removeItem("uid");
    navigation.navigate("SignIn");
  };
  return (
    <View style={styles.maincontainer}>
      <IconButton
        icon="home"
        color={Colors.primary}
        size={40}
        onPress={() => navigation.navigate("Explore")}
      />
      <Image
        style={styles.logoContainer}
        resizeMode={"stretch"}
        source={require("../assets/uhsm_logo.png")}
      />
      <TouchableOpacity
        style={styles.tokenIcon}
        onPress={() => navigation.navigate("Wallet")}
      >
        <Image
          source={require("../assets/icon_tokens.png")}
          resizeMode={"contain"}
          style={styles.imgContainer}
        />
        <Text style={styles.textContainer}>
          {(profile && (profile.tokens || 0) - (profile.tokenSpent || 0)) || 0}
        </Text>
      </TouchableOpacity>
      <View style={{ zIndex: 100, marginTop: 2 }}>
        <Provider>
          <View>
            <Menu
              visible={visible}
              style={{
                top: 50,
                left: -100,
                position: "absolute",
                zIndex: 100,
              }}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="account"
                  color={Colors.primary}
                  size={40}
                  onPress={openMenu}
                />
              }
            >
              <Menu.Item onPress={logOut} title="Log out" />
            </Menu>
          </View>
        </Provider>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  maincontainer: {
    width: "100%",
    height: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100,
    position: "relative",
  },
  tokenIcon: {
    height: 40,
    width: 40,
    position: "relative",
  },
  imgContainer: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    top: 13,
    textAlign: "center",
    fontSize: 11,
  },
  homeButton: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    width: 160,
    height: 50,
  },
});
export default TopBar;
