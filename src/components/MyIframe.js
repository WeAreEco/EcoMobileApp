import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import colors from "../theme/Colors";
import { Metrics } from "../theme";
import TopBar from "./TopBar";
import SubTabs from "./SubTabs";

const MyIframe = ({ url, subTabs }) => {
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
    console.log("loaded iframe");
  };
  return (
    <View style={styles.maincontainer}>
      <TopBar />
      {subTabs ? <SubTabs tabs={subTabs} /> : null}
      <WebView
        originWhitelist={["*"]}
        // key={key}
        source={{
          uri: url,
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
    display: "flex",
    flexDirection: "column",
    paddingTop: 29,
    backgroundColor: colors.white,
  },
});

export default MyIframe;
