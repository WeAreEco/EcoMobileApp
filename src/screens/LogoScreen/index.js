import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import FadeInView from "react-native-fade-in-view";
import { connect } from "react-redux";
import colors from "../../theme/Colors";
import { Metrics } from "../../theme";
import { saveProfile, saveBrand, saveUID } from "../../Redux/actions/index";
import { isSession } from "../../utils/functions";
import Firebase from "../../firebasehelper";
class LogoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIn: new Animated.Value(0),
      fadeOut: new Animated.Value(1),
    };
  }
  fadeIn() {
    this.state.fadeIn.setValue(0);
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => this.fadeOut());
  }
  fadeOut() {
    this.state.fadeIn.setValue(1);
    Animated.timing(this.state.fadeIn, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => this.Start());
  }

  componentDidMount() {
    // Get Brand Info
    Firebase.getBrandDataByName("WeShare", (brand) => {
      this.props.dispatch(saveBrand(brand));
      AsyncStorage.setItem("brand", JSON.stringify(brand));
    });

    this.fadeIn();
  }
  Start = () => {
    isSession()
      .then((res) => {
        if (res) {
          this.props.dispatch(saveProfile(res));
          this.props.dispatch(saveUID(res.uid));
          this.props.dispatch(saveBrand(res.brand));
          this.props.navigation.navigate("Main");
        } else this.props.navigation.navigate("Landing");
      })
      .catch((err) => {
        console.log("Error", err);
        this.props.navigation.navigate("Landing");
      });
  };

  render() {
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          backgroundColor: colors.uhsm,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View style={{ opacity: this.state.fadeIn }}>
          <View>
            <Image
              source={require("../../assets/uhsm_main_logo.jpeg")}
              style={{ width: 170, height: 60 }}
              resizeMode={"contain"}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    profile: state.profile,
    brand: state.brand,
    uid: state.uid,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LogoScreen);
