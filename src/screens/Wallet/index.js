import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  StyleSheet,
  ImageBackground,
  Button,
} from "react-native";
import { WebView } from "react-native-webview";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import BraintreeDropIn from "react-native-braintree-dropin-ui";

import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Header from "./Header";
import { Metrics } from "../../theme";
import { saveWalletScreen, saveExploreScreen } from "../../Redux/actions/index";
import Firebase from "../../firebasehelper";
import {
  braintreeToken,
  braintreeRemovePaymentMethod,
} from "../../functions/BraintreeHelper";

const iconCharity = require("../../assets/wallet/tokens/charity.png");
const iconHealth = require("../../assets/wallet/tokens/health.png");
const iconShopping = require("../../assets/wallet/tokens/shopping.png");
const iconTravel = require("../../assets/wallet/tokens/travel.png");
const iconSubscriptions = require("../../assets/wallet/subscriptions/subscription.png");
const iconMarketplace = require("../../assets/wallet/subscriptions/marketplace.png");
const iconActive = require("../../assets/wallet/subscriptions/active.png");
const iconPending = require("../../assets/wallet/subscriptions/pending.png");
const iconCard = require("../../assets/wallet/cards/creditcard.jpg");
const iconCardOne = require("../../assets/wallet/cards/one.png");
const iconCardTwo = require("../../assets/wallet/cards/two.png");
const iconCardClose = require("../../assets/wallet/cards/close.png");
const iconPound = require("../../assets/wallet/pound.png");

const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`;

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      isViewTokenLedgerVisible: false,
      tokensHistory: {},
      braintreeToken: "",
      paymentMethods: [],
      subscriptions: [],
      packages: [],
    };
  }
  componentDidMount() {
    const { basic, uid, brand } = this.props;

    let result = false;
    if (basic) {
      this.setState({ profile: basic });
    }

    Firebase.getAllPaymentMethods(brand.name, uid, (methods) =>
      this.setState({ paymentMethods: methods })
    );

    Firebase.getAllSubscriptions(brand.name, uid, (subscriptions) =>
      this.setState({ subscriptions })
    );

    Firebase.getBoltPackages((res) => {
      const { inactiveBoltPackages } = brand;
      let boltPackages = Object.keys(res)
        .filter(
          (packageId) =>
            !(inactiveBoltPackages || []).find((item) => item === packageId)
        )
        .reduce((prev, id) => {
          const obj = res[id];
          prev[obj.order] = { id, ...obj };
          return prev;
        }, []);
      console.log("ecosystem packages", boltPackages);
      let brandPackages = Object.keys(brand.packages || {}).reduce(
        (prev, id) => {
          const obj = (brand.packages || {})[id];
          prev[obj.order] = { id, ...obj };
          return prev;
        },
        []
      );
      console.log("brand_packages", brandPackages);
      let packages = boltPackages.concat(brandPackages);
      console.log("packages", packages);
      this.setState({ packages });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // if (nextProps) {
    //   const { route } = nextProps;
    //   if (!route) {
    //     return null;
    //   }
    //   const { params } = route;
    //   if (params
    //     && params.screen
    //     && params.screen != prevState.screen) {
    //     return ({ screen: params.screen }) // <- this is setState equivalent
    //   }
    // }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps && prevProps.route && prevProps.route.params) {
    //   const { screen } = prevProps.route.params;
    //   console.log('prevProps screen', screen);
    // }
    // console.log('prevState screen', prevState.screen);
    const { wallet_screen } = this.props;
    const { braintreeToken } = this.state;
    if (wallet_screen == "Cards" && !braintreeToken) {
      this.fetchBraintreeToken();
    }
  }

  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };

  onTap = (screen) => {
    this.props.dispatch(saveWalletScreen(screen));
  };

  onPressViewTokenLedger = () => {
    this.setState({ isViewTokenLedgerVisible: true });

    const { brand, uid, basic } = this.props;

    Firebase.getTokenSpentHistory(brand.name, uid, (history) => {
      console.log("tokensHistory", history);
      const groupedByDate = _.groupBy(history, (obj) =>
        moment(obj.created.toDate()).format("LL")
      );
      const tokensHistory = Object.keys(groupedByDate).reduce((prev, date) => {
        var spent = 0;
        var earned = 0;
        groupedByDate[date].forEach((obj1) => {
          if (obj1.amount > 0) {
            spent += obj1.amount;
          } else {
            earned += -obj1.amount;
          }
        });
        prev[date] = { spent, earned };
        return prev;
      }, {});

      this.setState({ tokensHistory });
    });
  };

  // onBackdropViewTokenLedgerModal = () => {
  //   this.setState({ isViewTokenLedgerVisible: false });
  // };

  async fetchBraintreeToken() {
    // Get a client token for authorization from your server
    const tokenRes = await braintreeToken();
    if (tokenRes.status === "1") {
      console.log("braintreeToken", tokenRes.data);
      this.setState({ braintreeToken: tokenRes.data });
    }
  }

  onPressAddLinkedCard = () => {
    const { braintreeToken } = this.state;

    if (!braintreeToken) {
      return;
    }

    BraintreeDropIn.show({
      clientToken: braintreeToken,
      threeDSecure: {
        amount: 1.0,
      },
      merchantIdentifier: "applePayMerchantIdentifier",
      googlePayMerchantId: "googlePayMerchantId",
      countryCode: "US", //apple pay setting
      currencyCode: "USD", //apple pay setting
      merchantName: "Your Merchant Name for Apple Pay",
      orderTotal: "Total Price",
      googlePay: true,
      applePay: true,
      vaultManager: true,
      cardDisabled: false,
      darkTheme: true,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        if (error.code === "USER_CANCELLATION") {
          // update your UI to handle cancellation
        } else {
          // update your UI to handle other errors
          // for 3D secure, there are two other specific error codes: 3DSECURE_NOT_ABLE_TO_SHIFT_LIABILITY and 3DSECURE_LIABILITY_NOT_SHIFTED
        }
      });
  };

  onPressVisitEcoShop = () => {
    this.props.dispatch(saveExploreScreen("Marketplace"));
    this.navigateTo("Explore", { screen: "Marketplace" });
  };

  onLoadFinishedEarnTokens = () => {
    let { uid, basic, brand } = this.props;
    // console.log('/// uid', uid);
    // console.log('/// basic', basic);
    // console.log('/// brand', brand);
    if (this.webViewEarnTokens) {
      this.webViewEarnTokens.postMessage(
        JSON.stringify({
          fromMobile: true,
          uid: uid,
        })
      );
    }
  };

  onEventHandlerEarnTokens = (data) => {
    console.log("----- Offers data", data);
  };

  removePaymentMethod = (paymentId, paymentToken) => async () => {
    const { uid, brand } = this.props;
    await Firebase.removePaymentMethod(brand.name, uid, paymentId);
    if (paymentToken) {
      const res = await braintreeRemovePaymentMethod(paymentToken);
    }
  };

  render() {
    const { wallet_screen } = this.props;
    let screen = wallet_screen;
    if (!screen) {
      screen = "Tokens";
    }

    const {
      profile,
      isViewTokenLedgerVisible,
      paymentMethods,
      subscriptions,
      packages,
      tokensHistory,
    } = this.state;
    const subscriptionsList = subscriptions
      .map((subscription) => {
        const product = packages.find(
          (pObj) => pObj.id === subscription.product_id
        );
        return { ...subscription, product };
      })
      .filter((subscription) => !!subscription.product);

    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 180,
            display: "flex",
            alignItems: "center",
            // backgroundColor: colors.green,
          }}
        >
          <TopImage />
          <Logo />
        </View>
        <Header onTap={this.onTap} current={screen} />

        {screen == "Tokens" && (
          <KeyboardAwareScrollView
            style={{
              width: "100%",
              height: "100%",
              // backgroundColor: colors.green,
            }}
            contentContainerStyle={styles.ContentScrollView}
          >
            {/* EcoPay */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>Shopping</Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>
                    {(profile &&
                      (profile.tokens || 0) - (profile.tokenSpent || 0)) ||
                      0}
                  </Text>
                  <Text style={styles.TokensElementTokens}>tokens</Text>
                </View>
              </View>
              <Text style={styles.TokensElementDescription}>
                Spend on shopping in EcoPay & EcoStore at 3-20 tokens per £1
              </Text>

              <Image
                source={iconShopping}
                resizeMode={"contain"}
                style={styles.TokensElementImage}
              />
            </View>

            {/* Pound */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>Premier</Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>0</Text>
                  <Text style={styles.TokensElementTokens}>tokens</Text>
                </View>
              </View>
              <Image
                source={iconPound}
                resizeMode={"contain"}
                style={styles.TokensElementImage}
              />
              <Text style={styles.TokensElementDescription}>
                Spend on shopping in EcoPay & EcoStore at full value on spend
              </Text>
            </View>

            {/* Charity */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>Charity</Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>0</Text>
                  <Text style={styles.TokensElementTokens}>tokens</Text>
                </View>
              </View>
              <Text style={styles.TokensElementDescription}>
                Earned on behalf of charity, eco & social causes, voted by you.
              </Text>
              <Image
                source={iconCharity}
                resizeMode={"contain"}
                style={styles.TokensElementImage}
              />
            </View>

            {/* Health */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>Health</Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>0</Text>
                  <Text style={styles.TokensElementTokens}>tokens</Text>
                </View>
              </View>
              <Text style={styles.TokensElementDescription}>
                Spend on health & wellness to boost you wellbeing.
              </Text>
              <Image
                source={iconHealth}
                resizeMode={"contain"}
                style={styles.TokensElementImage}
              />
            </View>

            {/* Travel */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>Travel</Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>0</Text>
                  <Text style={styles.TokensElementTokens}>tokens</Text>
                </View>
              </View>
              <Text style={styles.TokensElementDescription}>
                Earn towards your travel wishlist & redeem on booking.
              </Text>
              <Image
                source={iconTravel}
                resizeMode={"contain"}
                style={styles.TokensElementImage}
              />
            </View>

            {/* View Token Ledger */}
            <TouchableOpacity
              onPress={this.onPressViewTokenLedger}
              style={styles.TouchViewTokenLedger}
            >
              <Text style={styles.TokensElementTitle}>View Token Ledger</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        )}

        {screen == "Cards" && (
          <KeyboardAwareScrollView
            style={{
              width: "100%",
              height: "100%",
              // backgroundColor: colors.green,
            }}
            contentContainerStyle={styles.ContentScrollView}
          >
            <View style={styles.EmptyContainer}>
              <Image
                source={iconMarketplace}
                resizeMode={"contain"}
                style={styles.ImageSubscriptions}
              />

              <Text style={styles.TextCardsDescription}>
                Spend with EcoPay{"\n"}
                Earn tokens with retailers{"\n"}
                Purchase in the Marketplace{"\n"}
                Subscribe in the Marketplace
              </Text>

              {/* Add Linked Cards */}
              <TouchableOpacity
                onPress={this.onPressAddLinkedCard}
                style={styles.TouchAddLinkedCard}
              >
                <Text style={styles.TokensElementTitle}>Add linked cards</Text>
              </TouchableOpacity>
            </View>
            {paymentMethods &&
              paymentMethods.slice(0, 2).map((item, index) => {
                return (
                  <ImageBackground
                    source={iconCard}
                    style={styles.CardContainer}
                    imageStyle={styles.Card}
                  >
                    <Image
                      source={index === 0 ? iconCardOne : iconCardTwo}
                      style={styles.CardIndex}
                    />
                    <TouchableOpacity
                      onPress={this.removePaymentMethod(item.id, item.token)}
                      style={styles.CardClose}
                    >
                      <Image source={iconCardClose} style={styles.Card} />
                    </TouchableOpacity>

                    <Text style={styles.CardNumber}>
                      {item.details.lastFour}
                    </Text>
                  </ImageBackground>
                );
              })}
          </KeyboardAwareScrollView>
        )}

        {screen == "Subscriptions" && (
          <KeyboardAwareScrollView
            style={{
              width: "100%",
              height: "100%",
              // backgroundColor: colors.green,
            }}
            contentContainerStyle={styles.ContentScrollView}
          >
            {subscriptionsList.length === 0 && (
              <View style={styles.EmptyContainer}>
                <Image
                  source={iconSubscriptions}
                  resizeMode={"contain"}
                  style={styles.ImageSubscriptions}
                />

                <Text style={styles.TextCardsDescription}>
                  You don't have any active subscriptions or purchases.{"\n"}
                  Visit EcoShop to save time & money with our products &
                  packages.
                </Text>

                {/* Add Linked Cards */}
                <TouchableOpacity
                  onPress={this.onPressVisitEcoShop}
                  style={styles.TouchAddLinkedCard}
                >
                  <Text style={styles.TokensElementTitle}>Visit EcoShop</Text>
                </TouchableOpacity>
              </View>
            )}
            {subscriptionsList &&
              subscriptionsList.length > 0 &&
              subscriptionsList.map((subscription) => (
                <View style={styles.SubscriptionContainer}>
                  <Image
                    style={styles.SubscriptionStatus}
                    source={
                      subscription.status === "active"
                        ? iconActive
                        : iconPending
                    }
                  />
                  <Image
                    style={styles.ProductAvatar}
                    source={{ uri: subscription.product.image }}
                  />
                  <View
                    style={styles.ProductDescription}
                    className="product-description"
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {subscription.product.caption}
                    </Text>
                    <Text>
                      {subscription.type === 0
                        ? "Monthly subscription"
                        : "Single Purchase"}
                    </Text>
                    <Text>Personal Purchase</Text>
                    <Text>
                      £{subscription.amount} on card {subscription.credit_card}
                    </Text>
                  </View>
                </View>
              ))}
          </KeyboardAwareScrollView>
        )}

        {screen == "Earn Tokens" && (
          <View
            style={{
              width: "100%",
              height: Metrics.screenHeight - 260,
              // backgroundColor: colors.green,
            }}
          >
            <WebView
              style={
                {
                  // zIndex: 100,
                }
              }
              ref={(r) => (this.webViewEarnTokens = r)}
              originWhitelist={["*"]}
              source={
                Platform.OS === "ios"
                  ? { uri: "./external/earn/index.html" }
                  : { uri: "file:///android_asset/earn/index.html" }
              }
              onMessage={(event) =>
                this.onEventHandlerEarnTokens(event.nativeEvent.data)
              }
              injectedJavaScript={injectedJavascript}
              startInLoadingState
              domStorageEnabled={true}
              javaScriptEnabled
              onLoad={this.onLoadFinishedEarnTokens}
              mixedContentMode="always"
              thirdPartyCookiesEnabled
              allowUniversalAccessFromFileURLs
              useWebKit={true}
            />
          </View>
        )}

        <Modal
          style={styles.ViewTokenLeaderModal}
          isVisible={isViewTokenLedgerVisible}
          animationIn="slideInDown"
          onBackdropPress={() =>
            this.setState({ isViewTokenLedgerVisible: false })
          }
        >
          <View style={styles.ViewTokenLeaderWrapper}>
            <Text style={{ fontSize: 15, marginBottom: 20 }}>
              {profile.firstname}'s token ledger
            </Text>
            <View style={styles.VTL_Row}>
              <Text style={styles.VTL_Text}>Date</Text>
              <Text style={styles.VTL_Text}>Earned</Text>
              <Text style={styles.VTL_Text}>Spent</Text>
            </View>
            {Object.keys(tokensHistory || {}).map((date) => (
              <View style={styles.VTL_Row}>
                <Text style={styles.VTL_Text}>
                  {moment(date).calendar(null, {
                    sameDay: "[Today]",
                    nextDay: "[Tomorrow]",
                    nextWeek: "dddd",
                    lastDay: "[Yesterday]",
                    lastWeek: "[Last] dddd",
                    sameElse: "DD/MM/YYYY",
                  })}
                </Text>
                <Text style={styles.VTL_Text}>
                  {tokensHistory[date].earned}
                </Text>
                <Text style={styles.VTL_Text}>{tokensHistory[date].spent}</Text>
              </View>
            ))}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <Button
                onPress={() =>
                  this.setState({ isViewTokenLedgerVisible: false })
                }
                title="Close"
                color="#000000"
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ViewTokenLeaderModal: {
    // backgroundColor: colors.green,
  },
  ViewTokenLeaderWrapper: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 20,
  },
  VTL_Row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  VTL_Text: {
    width: "30%",
    fontSize: 16,
    fontWeight: "300",
  },
  ContentScrollView: {
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    paddingBottom: 50,
    // backgroundColor: colors.green
  },
  TokensElementWrapper: {
    width: 320,
    height: 80,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 15,
    marginLeft: 37.5,
  },
  TokensElementImage: {
    width: 75,
    height: 75,
    position: "absolute",
    marginLeft: -37.5,
    marginTop: 2.5,
    // backgroundColor: colors.green,
  },
  TokensElementContent: {
    paddingLeft: 20,
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  TokensElementDescription: {
    width: "50%",
    fontSize: 12,
    color: "#495057",
  },
  TokensElementTitle: {
    fontWeight: "500",
    fontSize: 16,
  },
  TokensElementContentLabel: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 5,
  },
  TokensElementValue: {
    fontWeight: "600",
    fontSize: 22,
  },
  TokensElementTokens: {
    fontWeight: "300",
    fontSize: 14,
    marginLeft: 5,
    color: "#495057",
  },
  TouchViewTokenLedger: {
    width: 350,
    height: 50,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 10,
  },
  TouchAddLinkedCard: {
    width: 220,
    height: 40,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 10,
  },
  TextCardsDescription: {
    maxWidth: 250,
    textAlign: "center",
    lineHeight: 40,
    fontSize: 17,
    fontWeight: "300",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  ImageSubscriptions: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  EmptyContainer: {
    height: 400,
    justifyContent: "space-between",
    alignItems: "center",
  },
  CardContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  Card: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  CardIndex: {
    position: "absolute",
    right: 30,
    top: 40,
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  CardClose: {
    width: 30,
    height: 30,
    left: 30,
    bottom: 50,
    position: "absolute",
  },
  CardNumber: {
    alignSelf: "flex-end",
    position: "absolute",
    right: 30,
    bottom: 50,
    fontSize: 20,
  },
  SubscriptionContainer: {
    width: "90%",
    margin: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 4,
    flexDirection: "row",
    backgroundColor: "white",
  },
  SubscriptionStatus: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 30,
    height: 30,
    resizeMode: "contain",
    zIndex: 100,
  },
  ProductAvatar: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  ProductDescription: {
    marginHorizontal: 10,
    alignSelf: "center",
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic,
    brand: state.brand,
    wallet_screen: state.wallet_screen,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
