import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import colors from "../theme/Colors";
import { Metrics } from "../theme";
import TopBar from "./TopBar";
import SubTabs from "./SubTabs";

const MyIframe = ({ url, iframeStyle, subTabs }) => {
  const [page, setPage] = useState("");
  useEffect(() => {
    if (subTabs && subTabs.length > 0) {
      const initialPage = subTabs[0]["page"];
      setPage(initialPage);
    }
  }, [subTabs]);
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
  const handleClickMenu = (page) => {
    setPage(page);
  };
  return (
    <View style={styles.maincontainer}>
      <TopBar />
      {subTabs ? <SubTabs tabs={subTabs} onPress={handleClickMenu} /> : null}
      <WebView
        originWhitelist={["*"]}
        // key={key}
        source={{
          uri: page ? `${url}&page=${page}` : url,
        }}
        style={iframeStyle}
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
