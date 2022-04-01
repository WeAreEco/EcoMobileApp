import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import colors from "../theme/Colors";
import { Metrics } from "../theme";
import TopBar from "./TopBar";
import SubTabs from "./SubTabs";

const MyIframe = ({ url, iframeStyle, subTabs, navigation }) => {
  const [page, setPage] = useState("");
  const route = useRoute();
  const [currentKey, setCurrentKey] = useState(Math.random() * 100);
  useEffect(() => {
    if (subTabs && subTabs.length > 0) {
      const initialPage = subTabs[0]["page"];
      setPage(initialPage);
    }
  }, [subTabs]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      if (route.name === "Earn") {
        // e.preventDefault();
        setCurrentKey(Math.random() * 100);
      }
    });
    return unsubscribe;
  }, [navigation]);
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
  const onLoadIframeFinished = (e) => {
    // console.log("loaded iframe", e.nativeEvent.url);
  };
  const handleClickMenu = (page) => {
    setPage(page);
  };
  return (
    <View style={styles.maincontainer}>
      <TopBar />
      {subTabs ? <SubTabs tabs={subTabs} onPress={handleClickMenu} /> : null}
      <WebView
        key={currentKey}
        originWhitelist={["*"]}
        source={{
          uri: page ? `${url}&page=${page}` : url,
        }}
        useWebKit={true}
        style={iframeStyle}
        allowsInlineMediaPlayback={true}
        // automaticallyAdjustContentInsets={false}
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
