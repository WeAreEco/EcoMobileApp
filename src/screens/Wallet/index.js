import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
  StyleSheet,
  ScrollView,
  Button
} from "react-native";
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import BraintreeDropIn from 'react-native-braintree-dropin-ui';

import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Header from "./Header";
import { Metrics } from "../../theme";
import {
  saveWalletScreen,
  saveExploreScreen
} from "../../Redux/actions/index";
import Firebase from "../../firebasehelper";
import { braintreeToken } from "../../functions/BraintreeHelper";

const iconCharity = require("../../assets/wallet/tokens/charity.png");
const iconHealth = require("../../assets/wallet/tokens/health.png");
const iconShopping = require("../../assets/wallet/tokens/shopping.png");
const iconTravel = require("../../assets/wallet/tokens/travel.png");
const iconSubscriptions = require("../../assets/wallet/subscriptions/subscription.png");

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
      braintreeToken: '',
    };
  }
  componentDidMount() {
    const { basic, uid } = this.props;
    
    let result = false;
    if (basic) {
      this.setState({ profile: basic });
    }
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
    return null
  }

  componentDidUpdate(prevProps, prevState) {    
    // if (prevProps && prevProps.route && prevProps.route.params) {
    //   const { screen } = prevProps.route.params;
    //   console.log('prevProps screen', screen);
    // }
    // console.log('prevState screen', prevState.screen);
    const { wallet_screen } = this.props;
    const { braintreeToken } = this.state;
    if (wallet_screen == 'Cards' 
      && !braintreeToken) {
      this.fetchBraintreeToken();
    }    
  };

  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };

  onTap = screen => {
    this.props.dispatch(saveWalletScreen(screen));
  };

  onPressViewTokenLedger = () => {
    this.setState({ isViewTokenLedgerVisible: true });

    const { brand, uid, basic } = this.props;

    Firebase.getTokenSpentHistory(brand.name, uid, (history) => {
      console.log('tokensHistory', history);
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
      console.log('braintreeToken', tokenRes.data);
      this.setState({ braintreeToken: tokenRes.data });
    }
  };

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
      merchantIdentifier: 'applePayMerchantIdentifier',
      googlePayMerchantId: 'googlePayMerchantId',
      countryCode: 'US',    //apple pay setting
      currencyCode: 'USD',   //apple pay setting
      merchantName: 'Your Merchant Name for Apple Pay',
      orderTotal:'Total Price',
      googlePay: true,
      applePay: true,
      vaultManager: true,
      cardDisabled: false,
      darkTheme: true,
    })
    .then(result => {
      console.log(result);

    })
    .catch((error) => {
      if (error.code === 'USER_CANCELLATION') {
        // update your UI to handle cancellation
      } 
      else {
        // update your UI to handle other errors
        // for 3D secure, there are two other specific error codes: 3DSECURE_NOT_ABLE_TO_SHIFT_LIABILITY and 3DSECURE_LIABILITY_NOT_SHIFTED
      }
    });
  };

  onPressVisitEcoShop = () => {
    this.props.dispatch(saveExploreScreen('Marketplace'));
    this.navigateTo('Explore', {screen: 'Marketplace'});
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
          uid: uid
        })
      );
    }
  };

  onEventHandlerEarnTokens = data => {
    console.log('----- Offers data', data);    
  };

  render() {
    const { wallet_screen } = this.props;
    let screen = wallet_screen;
    if (!screen) {
      screen = 'Tokens';
    }

    const { 
      profile, 
      isViewTokenLedgerVisible,
    } = this.state;        

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

        {screen == 'Tokens' && (
          <KeyboardAwareScrollView 
            style={{
              width: '100%',
              height: '100%',
              // backgroundColor: colors.green,
            }}
            contentContainerStyle={styles.ContentScrollView}>
            {/* EcoPay */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>
                  EcoPay & EcoShop
                </Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>
                    {(profile && (profile.tokens || 0) - (profile.tokenSpent || 0)) || 0}
                  </Text>
                  <Text style={styles.TokensElementTokens}>
                    tokens
                  </Text>
                </View>
              </View>
              <Image
                source={iconShopping}
                resizeMode={'contain'}
                style={styles.TokensElementImage}
              />
            </View>

            {/* Charity */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>
                  Charity
                </Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>
                    0
                  </Text>
                  <Text style={styles.TokensElementTokens}>
                    tokens
                  </Text>
                </View>
              </View>
              <Image
                source={iconCharity}
                resizeMode={'contain'}
                style={styles.TokensElementImage}
              />
            </View>

            {/* Health */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>
                  Health
                </Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>
                    0
                  </Text>
                  <Text style={styles.TokensElementTokens}>
                    tokens
                  </Text>
                </View>
              </View>
              <Image
                source={iconHealth}
                resizeMode={'contain'}
                style={styles.TokensElementImage}
              />
            </View>

            {/* Travel */}
            <View style={styles.TokensElementWrapper}>
              <View style={styles.TokensElementContent}>
                <Text style={styles.TokensElementTitle}>
                  Travel
                </Text>
                <View style={styles.TokensElementContentLabel}>
                  <Text style={styles.TokensElementValue}>
                    0
                  </Text>
                  <Text style={styles.TokensElementTokens}>
                    tokens
                  </Text>
                </View>
              </View>
              <Image
                source={iconTravel}
                resizeMode={'contain'}
                style={styles.TokensElementImage}
              />
            </View>

            {/* View Token Ledger */}
            <TouchableOpacity 
              onPress={this.onPressViewTokenLedger}
              style={styles.TouchViewTokenLedger}>
              <Text style={styles.TokensElementTitle}>
                View Token Ledger
              </Text>
            </TouchableOpacity>

          </KeyboardAwareScrollView>
        )}

        {screen == 'Cards' && (
          <KeyboardAwareScrollView 
            style={{
              width: '100%',
              height: '100%',
              // backgroundColor: colors.green,
            }}
            contentContainerStyle={styles.ContentScrollView}>

            {/* Add Linked Cards */}
            <TouchableOpacity 
              onPress={this.onPressAddLinkedCard}
              style={styles.TouchAddLinkedCard}>
              <Text style={styles.TokensElementTitle}>
                Add linked cards
              </Text>
            </TouchableOpacity>

            <Text style={styles.TextCardsDescription}>
              Spend with EcoPay{'\n'}
              Earn tokens with retailers{'\n'}
              Purchase in the Marketplace{'\n'}
              Subscribe in the Marketplace
            </Text>

          </KeyboardAwareScrollView>
        )}

        {screen == 'Subscriptions' && (
          <KeyboardAwareScrollView 
            style={{
              width: '100%',
              height: '100%',
              // backgroundColor: colors.green,
            }}
            contentContainerStyle={styles.ContentScrollView}>

            <Image
              source={iconSubscriptions}
              resizeMode={'contain'}
              style={styles.ImageSubscriptions}
            />

            <Text style={styles.TextCardsDescription}>
              You don't have any active
              subscriptions or purchases.{'\n'}
              Visit EcoShop to save time & money
              with our products & packages.
            </Text>

            {/* Add Linked Cards */}
            <TouchableOpacity 
              onPress={this.onPressVisitEcoShop}
              style={styles.TouchAddLinkedCard}>
              <Text style={styles.TokensElementTitle}>
                Visit EcoShop
              </Text>
            </TouchableOpacity>

          </KeyboardAwareScrollView>
        )}

        {screen == 'Earn Tokens' && (
          <View 
            style={{
              width: '100%',
              height: (Metrics.screenHeight - 260),              
              // backgroundColor: colors.green,
            }}
          >
          <WebView
            style={{ 
              // zIndex: 100,              
            }}
            ref={r => (this.webViewEarnTokens = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/earn/index.html" }
                : { uri: "file:///android_asset/earn/index.html" }
            }
            onMessage={event => this.onEventHandlerEarnTokens(event.nativeEvent.data)}
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
          animationIn='slideInDown'
          onBackdropPress={() => this.setState({ isViewTokenLedgerVisible: false })}
        >
          <View
            style={styles.ViewTokenLeaderWrapper}
          >
            <Text
              style={{ fontSize: 15, marginBottom: 20 }}
            >
              {profile.firstname}'s token ledger
            </Text>
            <View style={styles.VTL_Row}>
              <Text style={styles.VTL_Text}>Date</Text>
              <Text style={styles.VTL_Text}>Earned</Text>
              <Text style={styles.VTL_Text}>Spent</Text>
            </View>
            

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 20,
              }}
            >
              <Button
                onPress={() => this.setState({ isViewTokenLedgerVisible: false })}
                title="Close"
                color='#000000'
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  VTL_Text: {
    width: '30%',
    fontSize: 16,
    fontWeight: '300',
  },
  ContentScrollView: {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex',
    // backgroundColor: colors.green
  },
  TokensElementWrapper: {
    width: 350,
    height: 80,
    marginTop: 20,
    justifyContent: 'center',
    // backgroundColor: colors.white,    
    // alignItems: 'center',
  },
  TokensElementImage: {
    width: 75,
    height: 75,
    position: 'absolute',
    // backgroundColor: colors.green,
  },
  TokensElementContent: {
    width: 310,
    height: '100%',
    marginLeft: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 15,
  },
  TokensElementTitle: {
    fontWeight: '300',
    fontSize: 20,
  },
  TokensElementContentLabel: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 5,
  },
  TokensElementValue: {
    fontWeight: '600',
    fontSize: 22,
  },
  TokensElementTokens: {
    fontWeight: '300',
    fontSize: 12,
    marginLeft: 5,
  },
  TouchViewTokenLedger: {
    width: 350,
    height: 50,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 10,
  },
  TouchAddLinkedCard: {
    width: 250,
    height: 50,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 10,
  },
  TextCardsDescription: {
    textAlign: "center",
    lineHeight: 40,
    fontSize: 17,
    fontWeight: '300',    
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  ImageSubscriptions: {
    width: 100,
    height: 100,
    marginTop: 20,    
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    basic: state.basic,
    brand: state.brand,
    wallet_screen: state.wallet_screen
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);
