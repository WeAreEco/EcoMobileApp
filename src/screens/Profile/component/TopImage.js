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
import colors from "../../../theme/Colors";

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
    const { screen } = this.props;
    const { loggedIn } = this.state;

    return loggedIn && (
      <View
        style={Styles.topBarContainer}>
        <Image
          source={require("../../../assets/icon_tokens.png")}
          resizeMode={"contain"}
          style={Styles.imgContainer}
        />
        <Text
          style={Styles.textContainer}>
          1002
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
