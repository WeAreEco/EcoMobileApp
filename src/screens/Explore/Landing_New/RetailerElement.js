import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../../../theme/Colors";
import { Metrics } from "../../../theme";

export default class RetailerElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  Press = () => {
    const { PressItem, data } = this.props;
    PressItem(data);
  };
  render() {
    const { data, position } = this.props;
    // console.log('this.props', this.props);

    return (
      <TouchableOpacity onPress={this.Press}>
        <View
          style={{
            width: Metrics.screenWidth - 40,
            height: 150,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 10,
          }}
        >
          <View
            style={
              {
                // backgroundColor: colors.green
              }
            }
          >
            <Text style={Styles.caption}>#{position + 1 + " "}Offer</Text>
            <Image
              source={{
                uri: data.logo,
              }}
              resizeMode={"contain"}
              style={{
                width: (Metrics.screenWidth - 80) / 2,
                height: 60,
                // flex: 1,
                // resizeMode: "cover",
                // backgroundColor: colors.green
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
              // backgroundColor: colors.green
            }}
          >
            <Text style={Styles.subCaption}>
              Spend {data.redeemed.fullTokens} tokens{"\n"}
              on every £{data.redeemed.threshold} spent{"\n"}
              {data.redeemed.tokenPercentage}% insider saving
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const Styles = StyleSheet.create({
  caption: {
    fontFamily: "Gothic A1",
    fontWeight: "600",
    fontSize: 17,
    color: "black",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    // backgroundColor: colors.white,
  },
  subCaption: {
    width: (Metrics.screenWidth - 80) / 2,
    fontFamily: "Gothic A1",
    fontWeight: "500",
    fontSize: 15,
    color: "black",
    textAlign: "left",
    lineHeight: 30,
    // backgroundColor: colors.green,
  },
  // content: {
  //   fontFamily: "Gothic A1",
  //   fontSize: 15,
  //   fontWeight: "100",
  //   color: colors.darkblue,
  //   textAlign: "center"
  // }
});
