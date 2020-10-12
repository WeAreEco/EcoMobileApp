import React, { Component } from "react";
import { Platform, View, FlatList } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { connect } from "react-redux";
import IconMenu from "../../components/IconMenu";
import { sliderWidth, itemWidth } from "../../theme/Styles";
import colors from "../../theme/Colors";

const IS_ANDROID = Platform.OS === "android";
const walletTokens = require("../../assets/wallet/sub/wallet_tokens.png");
const walletEarnTokens = require("../../assets/wallet/sub/wallet_earn_tokens.png");
const walletCards = require("../../assets/wallet/sub/wallet_cards.png");
const walletSubscriptions = require("../../assets/wallet/sub/wallet_subscriptions.png");
const walletShopping = require("../../assets/wallet/sub/wallet_shopping.png");

let packages = [
  { title: "Tokens", img: walletTokens, index: 0 },
  { title: "Cards", img: walletCards, index: 1 },
  { title: "Subscriptions", img: walletSubscriptions, index: 2 },
  { title: "Earn Tokens", img: walletEarnTokens, index: 3 },
  // { title: "Shopping",      img: walletShopping,      index: 4 },
];

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('pack.index', nextProps);
    // if (nextProps) {
    //   const { route } = nextProps;
    //   if (!route) {
    //     return null;
    //   }
    //   const { params } = route;
    //   if (params
    //     && params.screen
    //     && params.screen != prevState.screen) {
    //     for (pack of packages) {
    //       if (pack.title == params.screen) {
    //         return ({ selectedIndex: pack.index, screen: pack.title }) // <- this is setState equivalent
    //       }
    //     }
    //   }
    // }
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
        }}
      >
        <FlatList
          contentContainerStyle={{
            // display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
