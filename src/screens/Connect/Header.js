import React, { Component } from "react";
import { Platform, View, FlatList } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { connect } from "react-redux";
import IconMenu from "../../components/IconMenu";
import { sliderWidth, itemWidth } from "../../theme/Styles";

const IS_ANDROID = Platform.OS === "android";
const feeds_img = require("../../assets/Connect/connect_feeds.png");
const polls_img = require("../../assets/Connect/connect_polls.png");
const friends_img = require("../../assets/Connect/connect_friends.png");

let packages = [
  { title: "Feeds", img: feeds_img, index: 0 },
  { title: "Polls", img: polls_img, index: 1 },
  { title: "Friends", img: friends_img, index: 2 },
];
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
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
      const { screen } = nextProps;
      if (screen === "Home")
        setTimeout(() => this._slider1Ref.snapToItem(1), 100);
      // return ({ activated: true }) // <- this is setState equivalent
    }
    return null;
  }
  componentDidMount() {}
  _renderItem = ({ item, index }) => {
    const { selectedIndex } = this.state;
    return (
      <IconMenu
        data={item}
        selected={selectedIndex}
        position={index}
        key={index}
        PressItem={this.Press}
      />
    );
  };
  Press = (data) => {
    const { onTap } = this.props;
    this.setState({ selectedIndex: data.index });
    onTap(data.title);
  };

  render() {
    const {} = this.state;
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
          justifyContent: "center",
        }}
      >
        <FlatList
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
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
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    screen: state.screen,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);
