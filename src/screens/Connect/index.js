import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import colors from "../../theme/Colors";
import Header from "./Header";
import { Metrics } from "../../theme";

const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`;

class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Feeds",
    };
  }

  onTap = (screen) => {
    console.log(screen);
    this.setState({ screen: screen });
  };

  componentDidMount = () => {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  };

  load = () => {
    console.log("loaded!");
    const { route } = this.props;
    if (route.params) {
      const { page } = route.params;
      console.log("page", page);
      this.setState({ screen: page });
    }
  };

  onLoadFinishedAssistants = () => {
    let { uid, basic, brand } = this.props;
    // console.log('/// uid', uid);
    // console.log('/// basic', basic);
    // console.log('/// brand', brand);
    // if (this.webViewAssistants) {
    //   this.webViewAssistants.postMessage(
    //     JSON.stringify({
    //       fromMobile: true,
    //       uid: uid
    //     })
    //   );
    // }
  };

  onEventHandlerAssistants = (data) => {
    console.log("----- Polls data", data);
  };

  onPressInviteFriend = () => {};

  render() {
    const { screen } = this.state;

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <TopImage />
        <Logo />
        <Header onTap={this.onTap} />
        <View
          style={{
            flex: 1,
            marginTop: 180,
            width: "100%",
            // backgroundColor: colors.green,
          }}
        >
          {screen == "Assistants" && (
            <View
              style={{
                width: "100%",
                height: Metrics.screenHeight - 250,
                // backgroundColor: colors.green,
              }}
            >
              <WebView
                style={
                  {
                    // zIndex: 100,
                    // backgroundColor: '#00000000'
                  }
                }
                ref={(r) => (this.webViewAssistants = r)}
                originWhitelist={["*"]}
                // source={{html: '<iframe width="100%" height="100%" src="https://myrobot.io/" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'}}
                source={{ uri: `https://myrobot.io/?uid=${this.props.uid}` }}
                onMessage={(event) =>
                  this.onEventHandlerAssistants(event.nativeEvent.data)
                }
                injectedJavaScript={injectedJavascript}
                startInLoadingState
                domStorageEnabled={true}
                javaScriptEnabled
                onLoad={this.onLoadFinishedAssistants}
                mixedContentMode="always"
                thirdPartyCookiesEnabled
                allowUniversalAccessFromFileURLs
                useWebKit={true}
              />
            </View>
          )}

          {screen == "Polls" && (
            <View
              style={{
                width: "100%",
                height: Metrics.screenHeight - 250,
              }}
            >
              <WebView
                style={
                  {
                    // zIndex: 100,
                    // backgroundColor: '#00000000'
                  }
                }
                ref={(r) => (this.webViewPolls = r)}
                originWhitelist={["*"]}
                source={
                  Platform.OS === "ios"
                    ? { uri: "./external/polls/index.html" }
                    : { uri: "file:///android_asset/polls/index.html" }
                }
                onMessage={(event) =>
                  this.onEventHandlerPolls(event.nativeEvent.data)
                }
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

          {screen == "Feeds" && (
            <View
              style={{
                width: "100%",
                height: Metrics.screenHeight - 250,
              }}
            >
              <WebView
                style={
                  {
                    // zIndex: 100,
                    // backgroundColor: '#00000000'
                  }
                }
                ref={(r) => (this.webViewPolls = r)}
                originWhitelist={["*"]}
                source={
                  Platform.OS === "ios"
                    ? { uri: "./external/feeds/index.html" }
                    : { uri: "file:///android_asset/feeds/index.html" }
                }
                onMessage={(event) =>
                  this.onEventHandlerPolls(event.nativeEvent.data)
                }
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

          {screen == "Friends" && (
            <View
              style={{
                width: "100%",
                height: Metrics.screenHeight - 250,
                // backgroundColor: colors.green,
              }}
            >
              <WebView
                style={
                  {
                    // zIndex: 100,
                    // backgroundColor: '#00000000'
                  }
                }
                ref={(r) => (this.webViewAssistants = r)}
                originWhitelist={["*"]}
                source={
                  Platform.OS === "ios"
                    ? { uri: "./external/friends/index.html" }
                    : { uri: "file:///android_asset/friends/index.html" }
                }
                onMessage={(event) =>
                  this.onEventHandlerAssistants(event.nativeEvent.data)
                }
                injectedJavaScript={injectedJavascript}
                startInLoadingState
                domStorageEnabled={true}
                javaScriptEnabled
                onLoad={this.onLoadFinishedAssistants}
                mixedContentMode="always"
                thirdPartyCookiesEnabled
                allowUniversalAccessFromFileURLs
                useWebKit={true}
              />
            </View>
          )}

          {screen == "Others_Friends" && (
            <KeyboardAwareScrollView
              style={{
                width: "100%",
                height: "100%",
                // backgroundColor: colors.green,
              }}
              contentContainerStyle={styles.ContentScrollView}
            >
              {/* Invite a friend */}
              <TouchableOpacity
                onPress={this.onPressInviteFriend}
                style={styles.TouchAddLinkedCard}
              >
                <Text style={styles.TokensElementTitle}>Invite a friend</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ContentScrollView: {
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    // backgroundColor: colors.green
  },
  TouchAddLinkedCard: {
    width: 300,
    height: 50,
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
  TokensElementTitle: {
    fontWeight: "300",
    fontSize: 20,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
    uid: state.uid,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Connect);

// export default StackNavigator;
