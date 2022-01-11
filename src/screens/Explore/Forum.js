import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import colors from "../../theme/Colors";
import { Metrics } from "../../theme";
const Forum = () => {
  const renderLoading = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          style={{
            marginBottom: 10,
          }}
        />
        <Text>Please wait...</Text>
      </View>
    );
  };
  const onLoadIframeFinished = () => {
    let self = this;
    console.log("loaded iframe");
  };
  return (
    <View style={styles.maincontainer}>
      <WebView
        originWhitelist={["*"]}
        // key={key}
        source={{
          uri: `https://uhsm.org?page=explore&uid=00H4KSVMCHnsF76MpVky`,
        }}
        automaticallyAdjustContentInsets={false}
        renderLoading={renderLoading}
        startInLoadingState
        onLoad={onLoadIframeFinished}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    //minHeight: Metrics.screenHeight - 20,
    display: "flex",
    flexDirection: "column",
    paddingTop: 29,
    paddingBottom: 20,
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default Forum;
