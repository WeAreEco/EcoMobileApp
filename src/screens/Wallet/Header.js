import React, { Component } from "react";
import { Platform, View, FlatList } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { connect } from "react-redux";
import IconMenu from "../../components/IconMenu";
import { sliderWidth, itemWidth } from "../../theme/Styles";
import colors from "../../theme/Colors";

const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
const walletTokens        = require("../../assets/wallet/sub/wallet_tokens.png");
const walletEarnTokens    = require("../../assets/wallet/sub/wallet_earn_tokens.png");
const walletCards         = require("../../assets/wallet/sub/wallet_cards.png");
const walletSubscriptions = require("../../assets/wallet/sub/wallet_subscriptions.png");
const walletShopping      = require("../../assets/wallet/sub/wallet_shopping.png");

let packages = [
  { title: "Tokens",        img: walletTokens,        index: 0 },
  { title: "Earn Tokens",   img: walletEarnTokens,    index: 1 },
  { title: "Cards",         img: walletCards,         index: 2 },
  { title: "Subscriptions", img: walletSubscriptions, index: 3 },
  { title: "Shopping",      img: walletShopping,      index: 4 }
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
      const { screen } = nextProps;
      if (screen === "Home")
        setTimeout(() => this._slider1Ref.snapToItem(1), 100);
        // return ({ activated: true }) // <- this is setState equivalent
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
            // width: "100%",
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
