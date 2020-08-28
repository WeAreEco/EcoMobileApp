import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  StyleSheet,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import TopImage from "../../../components/TopImage";
import Header from "./Header";

const wallet_img = require("../../../assets/Explore/landing/Wallet.jpg");

class Landing_New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMember: false
    };
  }
  componentDidMount() {
    const basic = this.props.basic;
    let result = false;
    if (basic.active) {
      this.setState({ isMember: true });
    } else this.setState({ isMember: false });
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  onTap = screen => {
    console.log(screen);
    this.setState({ screen: screen });
  };
  render() {
    const { isMember } = this.state;
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: colors.lightgrey,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 80,
            display: "flex",
            alignItems: "center",
            // backgroundColor: colors.green,  
          }}
        >
          <TopImage />
          <Logo />                    
        </View>
        <Header onTap={this.onTap} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "80%",
    height: "35%",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10
  }
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing_New);
