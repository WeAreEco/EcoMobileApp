import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import colors from "../../theme/Colors";
import { Metrics } from "../../theme";
import TopImage from "../../components/TopImage";
import Logo from "../../components/Logo";
import Firebase from "../../firebasehelper";
import {
  saveOnboarding,
  saveInvitation,
  resetConcierge,
} from "../../Redux/actions/index";

const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})()`;

function arraytoString(array) {
  let str = "";
  array.forEach((item) => {
    str += " " + item;
  });
  return str;
}
function clearAllTimeout() {
  var id = window.setTimeout(function () {}, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
}
class EcoPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pkgs: [],
      reset: false,
    };
  }
  componentDidMount() {
    let { uid, basic } = this.props;
    console.log("pkgs", this.props.basic.packages);
    if (this.props.basic.packages) {
      let promises = this.props.basic.packages.map((item) => {
        return Firebase.getPackageInfo(item.caption).then((res) => {
          return res;
        });
      });
      Promise.all(promises).then((res) => {
        console.log("pkgs", res);
        this.setState({ pkgs: res });
      });
    } else {
      this.setState({ pkgs: [] });
    }
    let phone = "";
    this.unsubscribeUserProfile = Firebase.firestore()
      .collection("user")
      .doc(uid)
      .onSnapshot((snapshot) => {
        let userprofile = snapshot.data();
        phone = userprofile.phonenumber;
        this.props.dispatch(saveOnboarding(userprofile));
        AsyncStorage.setItem("profile", JSON.stringify(userprofile));
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { reset } = this.state;

    if (reset) {
      this.restart();
    }
  }

  componentWillUnmount() {
    this.unsubscribeUserProfile();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { route } = nextProps;

    if (route && route.params) {
      const { reset } = route.params;
      if (reset) {
        // console.log('getDerivedStateFromProps');
        return { reset }; // <- this is setState equivalent
      }
    }
    return null;
  }

  restart = async () => {
    if (this.webview) {
      console.log("///// Reload....");
      this.webview.reload();
    }
  };

  navigateTo = (page, props) => {
    this.props.navigation.navigate(page, props);
  };

  onLoadFinished = () => {
    let { uid, basic } = this.props;
    console.log("/// uid", uid);
    console.log("/// basic", basic);
    if (this.webview) {
      this.webview.postMessage(
        JSON.stringify({
          fromMobile: true,
          uid: uid,
        })
      );
    }
  };

  onEventHandler = (data) => {
    console.log("------------- data", data);
    if (data === "my_ecosystem") {
      this.navigateTo("Explore");
    }
  };

  render() {
    const { uid } = this.props;

    return (
      <View style={styles.maincontainer}>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -29,
            zIndex: 1000,
          }}
        >
          <TopImage />
          <Logo />
        </View>
        <WebView
          style={{ zIndex: 100, marginTop: 90 }}
          ref={(r) => (this.webview = r)}
          originWhitelist={["*"]}
          source={{
            uri: `https://ecosystem.life/ecopay?uid=${uid}&headerhidden=true`,
          }}
          onMessage={(event) => this.onEventHandler(event.nativeEvent.data)}
          injectedJavaScript={injectedJavascript}
          startInLoadingState
          domStorageEnabled={true}
          javaScriptEnabled
          onLoad={this.onLoadFinished}
          mixedContentMode="always"
          thirdPartyCookiesEnabled
          allowUniversalAccessFromFileURLs
          useWebKit={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    //minHeight: Metrics.screenHeight - 20,
    display: "flex",
    flexDirection: "column",
    paddingTop: 29,
    backgroundColor: colors.white,
  },
  CalltoAction: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 15,
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: colors.white,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  button: {
    color: colors.darkblue,
    fontSize: 16,
    fontFamily: "Gothic A1",
    fontWeight: "100",
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 22,
    paddingRight: 22,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    marginTop: -5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  buttonGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabbutton: {
    width: 25,
    height: 25,
  },
  spinnerTextStyle: {
    color: "#FFF",
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
export default connect(mapStateToProps, mapDispatchToProps)(EcoPay);
