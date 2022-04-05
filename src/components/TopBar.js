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
const TopBar = ({ onClickHome }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
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
      <View style={styles.groupcontainer}>
        <IconButton
          icon="home"
          color={Colors.primary}
          size={40}
          style={{ margin: 2, padding: 0, width: 40, height: 40 }}
          onPress={() => {
            onClickHome();
            navigation.navigate("Explore");
          }}
        />
        <IconButton
          icon="logout"
          color={Colors.primary}
          size={40}
          style={{ margin: 2, padding: 0, width: 40, height: 40 }}
          onPress={logOut}
        />
      </View>

      <Image
        style={styles.logoContainer}
        resizeMode={"stretch"}
        source={require("../assets/uhsm_logo.png")}
      />
      <View style={styles.groupcontainer}>
        <TouchableOpacity
          style={styles.tokenIcon}
          onPress={() => navigation.navigate("Wallet")}
        >
          <Image
            source={require("../assets/premier_token.png")}
            resizeMode={"contain"}
            style={styles.imgContainer}
          />
          <Text style={styles.textContainer}>
            {profile && (profile.premier_token || 0)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tokenIcon}
          onPress={() => navigation.navigate("Wallet")}
        >
          <Image
            source={require("../assets/shopping_token.png")}
            resizeMode={"contain"}
            style={styles.imgContainer}
          />
          <Text style={styles.textContainer}>
            {(profile && (profile.tokens || 0) - (profile.tokenSpent || 0)) ||
              0}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={{ zIndex: 100 }}>
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
                <TouchableOpacity style={styles.avatrIcon} onPress={openMenu}>
                  <Image
                    source={{ uri: profile && profile.avatar_url }}
                    resizeMode={"cover"}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </TouchableOpacity>
                // <IconButton
                //   icon="account"
                //   color={Colors.primary}
                //   size={40}
                //   onPress={openMenu}
                // />
              }
            >
              <Menu.Item onPress={logOut} title="Log out" />
            </Menu>
          </View>
        </Provider>
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  groupcontainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  maincontainer: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 100,
    position: "relative",
    backgroundColor: "white",
  },
  tokenIcon: {
    height: 40,
    width: 40,
    margin: 2,
    position: "relative",
  },
  avatrIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    marginTop: 15,
    marginRight: 5,
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
    width: 120,
    height: 40,
  },
});
export default TopBar;
