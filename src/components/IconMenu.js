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
import colors from "../theme/Colors";
export default class IconMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  Press = () => {
    const { PressItem, data, isTitleHidden } = this.props;
    PressItem(data);
  };
  render() {
    const { data, isTitleHidden, selected, position } = this.props;
    const { title, img } = data;

    return (
      <TouchableOpacity onPress={this.Press}>
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundColor:
              selected == position ? colors.lightgrey : colors.white,
            shadowOffset: { height: 2, width: 2 },
            shadowColor: colors.darkblue,
            shadowOpacity: 0.2,
            elevation: 3,
            marginHorizontal: 5,
          }}
        >
          {img && (
            <Image
              source={img}
              resizeMode={"contain"}
              style={{
                width: isTitleHidden ? 65 : 35,
                height: isTitleHidden ? 65 : 35,
                marginBottom: isTitleHidden ? 0 : 5,
                // flex: 1,
                // resizeMode: "cover",
                // backgroundColor: colors.green
              }}
            />
          )}
          {!isTitleHidden && <Text style={Styles.caption}>{title}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
}
const Styles = StyleSheet.create({
  caption: {
    fontFamily: "Gothic A1",
    fontWeight: "500",
    fontSize: 10,
    color: "black",
    textAlign: "center",
  },
  subCaption: {
    fontFamily: "Gothic A1",
    fontWeight: "500",
    fontSize: 15,
    color: "black",
    textAlign: "center",
  },
  content: {
    fontFamily: "Gothic A1",
    fontSize: 15,
    fontWeight: "100",
    color: colors.darkblue,
    textAlign: "center",
  },
});
