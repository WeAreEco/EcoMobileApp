import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Sound from "react-native-sound";
import colors from "../../theme/Colors";
import Metrics from "../../theme/Metrics";
import TopImage from "../../components/TopImage";
import Logo from "../../components/Logo";

// var bamboo = new Sound("bamboo.mp3", Sound.MAIN_BUNDLE, error => {
//   if (error) {
//     console.log("failed to load the sound", error);
//     return;
//   }
//   // Play the sound with an onEnd callback
//   bamboo.play(success => {
//     if (success) {
//       console.log("successfully finished playing");
//     } else {
//       console.log("playback failed due to audio decoding errors");
//     }
//   });
// });
// bamboo.setVolume(0.5);
class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: "false",
    };
  }
  signIn = () => {
    this.props.navigation.navigate("SignIn");
  };
  joinMember = () => {
    this.props.navigation.navigate("Onboard");
  };
  render() {
    return (
      <View
        style={{
          width: "100%",
          padding: 20,
          flex: 1,
          height: Metrics.screenHeight,
          alignItems: "center",
          backgroundColor: colors.lightgrey,
        }}
      >
        <Logo />
        <View
          style={{
            marginTop: 20,
            width: "100%",
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: colors.lightgrey,
          }}
        >
          <View style={Styles.JoinProfileContainer}>
            <Text style={[Styles.Title, { color: colors.darkblue }]}>
              Join UHSM community
            </Text>
            <Image
              source={require("../../assets/Landing/blogging.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
              Process your USHM reimbursements for healthcare.
            </Text>
            <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
              Insider access to content, perks, offers and savings.
            </Text>
            <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
              Earn social tokens to spend across all walks of life.
            </Text>
            <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
              Share tokens and love with your friends and family.
            </Text>
            <TouchableOpacity
              onPress={this.joinMember}
              style={[Styles.CallAction, { backgroundColor: colors.primary }]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.darkblue,
                  fontWeight: "500",
                }}
              >
                Join Now
              </Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.SignInContainer}>
            <Text style={[Styles.Title, { color: colors.darkblue }]}>
              Already a member
            </Text>
            <Image
              source={require("../../assets/Landing/blogging.png")}
              style={{ width: 60, height: 60 }}
            />
            <Text style={[Styles.SubTitle, { color: colors.darkblue }]}>
              Those who have joined the community.
            </Text>
            <TouchableOpacity
              onPress={this.signIn}
              style={[Styles.CallAction, { backgroundColor: colors.grey }]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.darkblue,
                  fontWeight: "500",
                }}
              >
                Sign me in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  SignInContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 250,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    padding: 10,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
  JoinProfileContainer: {
    backgroundColor: colors.grey,
    borderRadius: 10,
    height: 280,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    color: colors.darkblue,
    paddingVertical: 10,
    paddingHorizontal: 10,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
  Title: { fontSize: 27, fontFamily: "Gothic A1", fontWeight: "200" },
  SubTitle: {
    fontSize: 12,
    fontFamily: "Gothic A1",
    textAlign: "center",
  },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
  },
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
