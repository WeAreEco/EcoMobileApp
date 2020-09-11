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
  FlatList
} from "react-native";
import {WebView} from 'react-native-webview';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import colors from "../../../theme/Colors";
import Logo from "../../../components/Logo";
import TopImage from "../../../components/TopImage";
import Header from "./Header";
import RetailerElement from './RetailerElement'
import Firebase from "../../../firebasehelper";
import { Metrics } from "../../../theme";
import {
  saveWalletScreen,
  saveExploreScreen
} from "../../../Redux/actions/index";

const wallet_img = require("../../../assets/Explore/landing/Wallet.jpg");
const live_sub_img = require("../../../assets/Explore/green-circle.png");
const eco_sub_img = require("../../../assets/Explore/yellow-circle.png");

// const window = Dimensions.get('window');
// const elementWidth = window.width / 2 - 40;
// const elementHeight = window.width / 2 - 40;

const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`;

class Landing_New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      brand: {},
      top10Retailers: [],
      timeToGo: 0,
      latestPoll: {},
      latestPost: {},
      subscription: {},
    };
  }
  componentDidMount() {
    const { uid, basic, brand } = this.props;
    this.setState({ profile: basic, brand: brand });

    // Top 10 Retailers
    Firebase.getAllDeactiveRetailers((res) => {
      let deactive = [];
      if (res) deactive = res;
      Firebase.getAllRetailers((res) => {
        const top10Retailers = res.filter(
          (obj) =>
            !deactive[obj.uid] 
            && obj.top10 
            && obj.top10 != 'none' 
            // && (obj.territory || TerritoryOptions[0]) === brandTerritory
        );
        this.setState({ top10Retailers });
        // console.log('/// top10Retailers -- ', top10Retailers.length);
        if (top10Retailers.length > 0) {
          this.delayLinks();
        }
      });
    });

    // Latest Poll, Ecosystem = 0
    Firebase.getBrandDataByID('0', async (brand_data) => {

      const pollData = brand_data.polls || [];
      pollData.sort((a, b) => b.created_at - a.created_at);
      if (pollData.length > 0) {
        this.setState({ latestPoll: pollData[0] });
      }      
    });

    // Latest Post
    Firebase.getAllPosts('Ecosystem', async (posts) => {
      posts.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      if (posts.length > 0) {
        this.setState({ latestPost: posts[0] });
      }
    });

    // Subscriptions
    // Firebase.getAllSubscriptions('Ecosystem', uid, (subscriptions) => {

      // if (subscriptions.length == 0) {
      //   return;
      // }

      // let lastSubscription = subscriptions[subscriptions.length - 1];

      Firebase.getBoltPackages((res) => {
        let boltPackages = Object.keys(res).reduce((prev, id) => {
          const obj = res[id];
          prev[obj.order] = { id, ...obj };
          return prev;
        }, []);

        let brandPackages = Object.keys(brand.packages || {}).reduce(
          (prev, id) => {
            const obj = (brand.packages || {})[id];
            prev[obj.order] = { id, ...obj };
            return prev;
          },
          []
        );

        let packages = boltPackages.concat(brandPackages);
        if (packages.length > 0) {
          // let subscription = packages.find((obj) => obj.id === lastSubscription.product_id);//'health_fitness');//
          subscription = packages[packages.length - 1];          
          this.setState({ subscription });
        }        
      });
    // });
  }
  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };
  onTap = screen => {
    this.props.dispatch(saveExploreScreen(screen));
    this.setState({ timeToGo: 0 });
  };

  onTapRetailer = retailer => {

  };

  _renderItem = ({ item, index }) => {
    // console.log('_renderItem', index);
    return <RetailerElement data={item} position={index} key={index} PressItem={this.onTapRetailer} />;
  };

  delayLinks = () => {
    const { top10Retailers, timeToGo } = this.state;
    let timeIndex = timeToGo;
    if (timeIndex >= top10Retailers.length) 
      timeIndex = 0;

    if (this.flatListRef 
      && top10Retailers.length > 0) {
      this.flatListRef.scrollToIndex({animated: true, index: timeIndex});
    }

    var next = timeIndex == top10Retailers.length - 1 ? 0 : timeIndex + 1;
    this.setState({ timeToGo: next });

    this.timerId = setTimeout(
      function () {
        this.delayLinks();
      }.bind(this),
      4000
    );
  };

  onEventHandlerOffers = data => {
    console.log('----- Offers data', data);    
  };

  onEventHandlerPolls = data => {
    console.log('----- Polls data', data);    
  };

  onEventHandlerShop = data => {
    console.log('----- Marketplace data', data);
    if (data == 'wallet_cards') {
      this.props.dispatch(saveWalletScreen('Cards'));
      this.navigateTo('Wallet', {screen: 'Cards'});
    }
  };

  onLoadFinishedShop = () => {
    let { uid, basic, brand } = this.props;
    // console.log('/// uid', uid);
    // console.log('/// basic', basic);
    // console.log('/// brand', brand);
    if (this.webViewShop) {
      this.webViewShop.postMessage(
        JSON.stringify({
          fromMobile: true,
          uid: uid
        })
      );
    }
  };

  onLoadFinishedOffers = () => {
    let { uid, basic, brand } = this.props;
    // console.log('/// uid', uid);
    // console.log('/// basic', basic);
    // console.log('/// brand', brand);
    if (this.webViewOffers) {
      this.webViewOffers.postMessage(
        JSON.stringify({
          fromMobile: true,
          uid: uid
        })
      );
    }
  };

  onLoadFinishedPolls = () => {
    let { uid, basic, brand } = this.props;
    // console.log('/// uid', uid);    
    if (this.webViewPolls) {
      console.log('/// basic', basic);
      console.log('/// brand', brand);
      this.webViewPolls.postMessage(
        JSON.stringify({
          fromMobile: true,
          uid: uid,
          brand: brand,
          profile: basic
        })
      );
    }
  };

  render() {
    const { 
      profile, 
      top10Retailers,
      latestPoll,
      latestPost,
      subscription } = this.state;

    const { explore_screen } = this.props;
    let screen = explore_screen;
    if (!screen) {
      screen = 'Home';
    }

    return (
      <View
        style={{
          display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          flexDirection: "column",
          // zIndex: 1000,
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

        {screen == 'Home' && (
          <KeyboardAwareScrollView 
            style={{
              width: '100%',
              height: (Metrics.screenHeight - 250),
            }}
            contentContainerStyle={styles.ContentScrollView}>
            {/* Top 10 Retailers */}
            <View style={styles.RetailersWrapper}>
              <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
                contentContainerStyle={styles.RetailersContainer}
                data={top10Retailers}
                renderItem={this._renderItem}
                horizontal={false}
              />
            </View>

            {/* Latest Poll */}
            <TouchableOpacity onPress={this.Press}>
              <View style={styles.ElementWrapper}>
                <View style={styles.ElementTextWrapper}>
                  <Text style={styles.ElementTextTitle}>Latest Poll</Text>
                  <Text 
                    style={styles.ElementTextDescription}
                    numberOfLines={3}
                    ellipsizeMode='tail'
                  >
                    {latestPoll ? latestPoll.question: ''}
                  </Text>
                </View>
                <View style={styles.ElementImageWrapper}>
                  <Image
                    source={{
                      uri: latestPoll ? latestPoll.question_img: '',
                    }}
                    resizeMode={'cover'}
                    style={styles.ElementImage}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Latest Post */}
            <TouchableOpacity onPress={this.Press}>
              <View style={styles.ElementWrapper}>
                <View style={styles.ElementTextWrapper}>
                  <Text style={styles.ElementTextTitle}>Latest Post</Text>
                  <Text 
                    style={styles.ElementTextDescription}
                    numberOfLines={3}
                    ellipsizeMode='tail'
                  >
                    {latestPost ? latestPost.content: ''}
                  </Text>
                </View>
                <View style={styles.ElementImageWrapper}>
                  <Image
                    source={{
                      uri: latestPost ? latestPost.img_url: '',
                    }}
                    resizeMode={'cover'}
                    style={styles.ElementImage}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Latest Subscription */}
            {subscription.id && (<TouchableOpacity onPress={this.Press}>
              <View style={styles.ElementWrapper}>
                <View style={styles.ElementTextWrapper}>
                  <Text style={styles.ElementTextTitle}>Subscription</Text>
                  <Text 
                    style={styles.ElementTextDescription}
                    numberOfLines={3}
                    ellipsizeMode='tail'
                  >
                    {subscription.caption + '\n' + subscription.footer_1 + '\n' + subscription.footer_2}
                  </Text>
                </View>
                <View style={styles.ElementImageWrapper}>
                  <Image
                    source={{
                      uri: subscription.image,
                    }}
                    resizeMode={'cover'}
                    style={styles.ElementImage}
                  />
                </View>
              </View>
            </TouchableOpacity>)}
                        
          </KeyboardAwareScrollView>
        )}    

        {screen == 'Offers' && (
          <View 
            style={{
              width: '100%',
              height: (Metrics.screenHeight - 250),              
            }}
          >
          <WebView
            style={{ 
              // zIndex: 100,
              // backgroundColor: '#00000000'
            }}
            ref={r => (this.webViewOffers = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/offers/index.html" }
                : { uri: "file:///android_asset/offers/index.html" }
            }
            onMessage={event => this.onEventHandlerOffers(event.nativeEvent.data)}
            injectedJavaScript={injectedJavascript}
            startInLoadingState
            domStorageEnabled={true}
            javaScriptEnabled
            onLoad={this.onLoadFinishedOffers}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
          </View>
        )}

        {screen == 'Polls' && (
          <View 
            style={{
              width: '100%',
              height: (Metrics.screenHeight - 250),              
            }}
          >
          <WebView
            style={{ 
              // zIndex: 100,
              // backgroundColor: '#00000000'
            }}
            ref={r => (this.webViewPolls = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/polls/index.html" }
                : { uri: "file:///android_asset/polls/index.html" }
            }
            onMessage={event => this.onEventHandlerPolls(event.nativeEvent.data)}
            injectedJavaScript={injectedJavascript}
            startInLoadingState
            domStorageEnabled={true}
            javaScriptEnabled
            onLoad={this.onLoadFinishedPolls}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
          </View>
        )}

        {screen == 'Feeds' && (
          <View 
            style={{
              width: '100%',
              height: (Metrics.screenHeight - 250),              
            }}
          >
          <WebView
            style={{ 
              // zIndex: 100,
              // backgroundColor: '#00000000'
            }}
            ref={r => (this.webViewPolls = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/feeds/index.html" }
                : { uri: "file:///android_asset/feeds/index.html" }
            }
            onMessage={event => this.onEventHandlerPolls(event.nativeEvent.data)}
            injectedJavaScript={injectedJavascript}
            startInLoadingState
            domStorageEnabled={true}
            javaScriptEnabled
            onLoad={this.onLoadFinishedPolls}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
          </View>
        )}

        {screen == 'Marketplace' && (
          <View 
            style={{
              width: '100%',
              height: (Metrics.screenHeight - 250),              
            }}
          >
          <WebView
            style={{ 
              // zIndex: 100,
              // backgroundColor: '#00000000'
            }}
            ref={r => (this.webViewShop = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/marketplace/index.html" }
                : { uri: "file:///android_asset/marketplace/index.html" }
            }
            onMessage={event => this.onEventHandlerShop(event.nativeEvent.data)}
            injectedJavaScript={injectedJavascript}
            startInLoadingState
            domStorageEnabled={true}
            javaScriptEnabled
            onLoad={this.onLoadFinishedShop}
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
            useWebKit={true}
          />
          </View>
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  ContentScrollView: {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex',
    // backgroundColor: colors.green
  },
  RetailersWrapper: {
    width: (Metrics.screenWidth - 40),
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 10,    
  },
  RetailersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.green,
  },
  ElementWrapper: {
    width: (Metrics.screenWidth - 40),
    height: 120,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    borderRadius: 10,    
  },
  ElementImageWrapper: {
    width: (Metrics.screenWidth - 40) / 2,
    height: '100%',    
    // backgroundColor: colors.white,
  },
  ElementImage: {
    width: '100%',
    height: '100%',
    // backgroundColor: colors.green 
  },
  ElementTextWrapper: {
    width: (Metrics.screenWidth - 40) / 2,
    height: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.green,
  },  
  ElementTextTitle: {
    fontFamily: 'Gothic A1',
    // justifyContent: 'center',
    fontSize: 17,    
    fontWeight: '600',    
  },
  ElementTextDescription: {
    fontFamily: 'Gothic A1',
    fontSize: 14,
    marginTop: 7,
    lineHeight: 20,
    textAlign: 'center',
    // backgroundColor: colors.green,
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
    explore_screen: state.explore_screen,
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing_New);
