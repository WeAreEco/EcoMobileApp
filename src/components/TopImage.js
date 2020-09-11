import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import colors from "../theme/Colors";

export default class TopImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      profile: {}
    };
  }

  componentDidMount() {
    this.checkUser();
  }

  async checkUser() {
    const uid = await AsyncStorage.getItem('uid');
    if (uid) {
      var profile = await AsyncStorage.getItem('profile');
      profile = JSON.parse(profile);
      this.setState({ loggedIn: true, profile });
    }
  }

  render() {
    const { loggedIn, profile } = this.state;

    return loggedIn && (
      <View
        style={Styles.topBarContainer}>

        <TouchableOpacity
          style={Styles.LogOut}
          onPress={() => this.LogOut()}
        >
          <Text>LogOut</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/icon_tokens.png")}
          resizeMode={"contain"}
          style={Styles.imgContainer}
        />

        <Text
          style={Styles.textContainer}>
          {(profile && (profile.tokens || 0) - (profile.tokenSpent || 0)) || 0}
        </Text>

      </View>      
    );
  }
}
const Styles = StyleSheet.create({
  topBarContainer: {
    width: "100%",
    height: 80,
    position: "absolute",
    alignItems: "flex-end",    
    top: 40,
  },
  imgContainer: {
    position: "absolute",
    width: 80,
    height: 40,    
    alignItems: "center"
  },
  textContainer: {
    position: "absolute",
    width: 80,
    height: 40,    
    alignItems: "center",
    top: 13,
    textAlign: 'center',
    fontSize: 11
  },
  LogOut: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    display: 'none'
  },
});
