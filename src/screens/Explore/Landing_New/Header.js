import React, { Component } from "react";
import { Platform, View, FlatList } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { connect } from "react-redux";
import IconMenu from "../../../components/IconMenu";
import { sliderWidth, itemWidth } from "../../../theme/Styles";
import colors from "../../../theme/Colors";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
const exploreHome = require("../../../assets/Explore/landing_new/explore_home.png");
const exploreOffers = require("../../../assets/Explore/landing_new/explore_offers.png");
const explorePolls = require("../../../assets/Explore/landing_new/explore_polls.png");
const exploreFeeds = require("../../../assets/Explore/landing_new/explore_feeds.png");
const exploreMarket = require("../../../assets/Explore/landing_new/explore_marketplace.png");
const exploreCommunity = require("../../../assets/Explore/landing_new/explore_community.png");
let packages = [
  { title: "Explore", img: exploreHome, index: 0 },
  // { title: "Community", img: exploreCommunity, index: 1 },
  { title: "EcoOffers", img: exploreOffers, index: 2 },
  // { title: "Polls", img: explorePolls, index: 2 },
  // { title: "Feeds", img: exploreFeeds, index: 3 },
  { title: "EcoStore", img: exploreMarket, index: 3 },
];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      // if (screen === "Home")
      // setTimeout(() => this._slider1Ref.snapToItem(1), 100);
      // return ({ activated: true }) // <- this is setState equivalent
    }
    return null;
  }
  componentDidMount() {}
  _renderItem = ({ item, index }) => {
    const { current } = this.props;
    let selectedIndex = 0;
    for (pack of packages) {
      if (pack.title == current) {
        selectedIndex = pack.index;
        break;
      }
    }

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
    // console.log("index", data.index);
    // this.setState({ selectedIndex: data.index });
    onTap(data.title);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 100,
          position: "absolute",
          top: 80,
          left: 0,
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center"
          // backgroundColor: colors.green,
        }}
      >
        <FlatList
          contentContainerStyle={{
            // display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            padding: 20,
          }}
          data={packages}
          renderItem={this._renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index}
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
