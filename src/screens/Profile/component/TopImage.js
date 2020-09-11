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
import colors from "../../../theme/Colors";

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

  logOut = () => {
    const {onLogout} = this.props;
    console.log('onLogout', '...');
    onLogout();
  };

  render() {
    const { screen } = this.props;
    const { loggedIn, profile } = this.state;

    return loggedIn && (
      <View
        style={Styles.topBarContainer}>
        <TouchableOpacity
          style={Styles.LogOut}
          onPress={this.logOut}
        >
          <Text>LogOut</Text>
        </TouchableOpacity>
        <Image
          source={require("../../../assets/icon_tokens.png")}
          resizeMode={"contain"}
          style={Styles.imgContainer}
        />
        <Text
          style={Styles.textContainer}>
          {(profile && (profile.tokens || 0) - (profile.tokenSpent || 0)) || 0}
        </Text>
      </View>      
    );

    // return (
    //   <Image
    //     source={
    //       screen === "Personal" || screen === "Pets"
    //         ? require("../../../assets/main/top_bar.png")
    //         : require("../../../assets/top_bar.png")
    //     }
    //     style={[
    //       Styles.imgContainer,
    //       { height: screen === "Personal" || screen === "Pets" ? 250 : 100 }
    //     ]}
    //   />
    // );
  }
}
const Styles = StyleSheet.create({
  // imgContainer: {
  //   width: "100%",
  //   position: "absolute",
  //   top: 0,
  //   left: 0
  // }
  topBarContainer: {
    width: "100%",
    height: 0,
    position: "absolute",
    // alignItems: "flex-end",    
    top: 40,
    backgroundColor: colors.white,
  },
  imgContainer: {
    position: "absolute",
    width: 80,
    height: 40,    
    alignItems: "center",
    right: 0,
  },
  textContainer: {
    position: "absolute",
    width: 80,
    height: 40,    
    alignItems: "center",
    top: 13,
    textAlign: 'center',
    fontSize: 11,
    right: 0,
  },
  LogOut: {
    // flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 30,
    marginTop: 5,
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: 15,
    // borderColor: colors.darkblue,
    // borderWidth: 1,
    backgroundColor: colors.white,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    // display: 'none',
  },
});
