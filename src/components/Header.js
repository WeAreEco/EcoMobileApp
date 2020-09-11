import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Carousel, { Pagination } from "react-native-snap-carousel";
import { connect } from "react-redux";
import colors from "../theme/Colors";
import IconMenu from "../components/IconMenu";
import { sliderWidth, itemWidth } from "../theme/Styles";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
const home_img     = require("../assets/Profile/ecoid_home.png");
const personal_img = require("../assets/Profile/ecoid_personal.png");
const timeline_img = require("../assets/Profile/ecoid_timeline.png");

let packages = [
  { title: "Home",     img: home_img, index: 0 },
  { title: "Personal", img: personal_img, index: 1 },
  { title: "Timeline", img: timeline_img, index: 2 }
];
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: SLIDER_1_FIRST_ITEM
    };
    console.log("props", props);
  }
  // componentWillReceiveProps(nextProps) {
  //   const { screen } = nextProps;
  //   console.log("nextProps", nextProps);
  //   if (screen === "Home")
  //     setTimeout(() => this._slider1Ref.snapToItem(1), 100);
  // }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.screen !== prevState.screen) {
      if (nextProps.screen === "Home")
        setTimeout(() => this._slider1Ref.snapToItem(1), 100);
      // return ({ total: nextProps.total }) // <- this is setState equivalent
    }
    return null
  }
  componentDidMount() {}
  _renderItem = ({ item, index }) => {
    return <IconMenu data={item} key={index} PressItem={this.Press} />;
  };
  Press = data => {
    const { onTap } = this.props;
    console.log("index", data.index);
    //this._slider1Ref.snapToItem(data.index);
    onTap(data.title);
  };

  render() {
    const { activeSlide } = this.state;
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 100,
          position: "absolute",
          top: 80,
          //top: 80,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* <Carousel
          layout={"default"}
          removeClippedSubviews={false}
          loop={true}
          inactiveSlideOpacity={1}
          ref={c => (this._slider1Ref = c)}
          data={packages}
          renderItem={this._renderItem}
          onSnapToItem={index => this.setState({ activeSlide: index })}
          sliderWidth={sliderWidth}
          itemWidth={80}
          firstItem={activeSlide}
        /> */}
        <FlatList
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%"
          }}
          data={packages}
          renderItem={this._renderItem}
          horizontal={true}
        />
      </View>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    screen: state.screen
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
