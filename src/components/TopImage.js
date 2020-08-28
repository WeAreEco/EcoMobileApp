import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import colors from "../theme/Colors";

export default class TopImage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  componentDidMount() {
    this.checkUser();
  }

  async checkUser() {
    const uid = await AsyncStorage.getItem('uid');
    if (uid) {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    const { loggedIn } = this.state;

    return loggedIn && (
      <View
        style={Styles.topBarContainer}>
        <Image
          source={require("../assets/icon_tokens.png")}
          resizeMode={"contain"}
          style={Styles.imgContainer}
        />
        <Text
          style={Styles.textContainer}>
          1002
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
  }
});
