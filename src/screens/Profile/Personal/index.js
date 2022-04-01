import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import ImageResizer from "react-native-image-resizer";
import colors from "../../../theme/Colors";
import { Metrics } from "../../../theme";
import ImgToBase64 from "react-native-image-base64";
import { saveOnboarding, removeAll } from "../../../Redux/actions/index";
import Firebase from "../../../firebasehelper";
import {
  isSession,
  isEmailValidate,
  isPasswordValidate,
  isJsonOk,
} from "../../../utils/functions";
const ok_img = require("../../../assets/success.png");
const cross_img = require("../../../assets/error.png");
const home_img = require("../../../assets/popup/home.png");
const balloon_img = require("../../../assets/popup/balloon.png");
const error_img = require("../../../assets/popup/error.png");
const profile_img = require("../../../assets/personal/profile.png");
const member_img = require("../../../assets/personal/verified.png");
class PersonalProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fullname: "",
      dob: "",
      phonenumber: "",
      activated: false,
      job: "photographer",
      ImageSource: require("../../../assets/avatar.png"),
      isloggedIn: false,
      modalVisible: false,
      successVisible: false,
      errorVisible: false,
      error_msg: "",
      profiletest_webview: false,
      basic: {
        firstname: "",
        dob: "",
        phonenumber: "",
      },
    };
    this.toggleProfile = this.toggleProfile.bind(this);
    this.toggleError = this.toggleError.bind(this);
  }
  toggleProfile(visible) {
    this.setState({ modalVisible: visible });
    this.refs.email_Input.focus();
  }
  toggleSuccess(visible) {
    this.setState({ successVisible: visible });
  }
  toggleError(visible) {
    this.setState({ errorVisible: visible });
  }
  openExplore = () => {
    this.toggleSuccess(false);
    this.navigateTo("Explore");
  };
  // componentWillReceiveProps(props) {
  //   let basic = props.basic;
  //   const { active } = basic;
  //   if (active) this.setState({ activated: true });
  //   console.log("basic in receive props", basic);
  //   //this.setState({ isloggedIn: true });
  // }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.basic !== prevState.basic) {
      let basic = nextProps.basic;
      const { active } = basic;
      if (active) return { activated: true }; // <- this is setState equivalent
    }
    return null;
  }
  componentDidMount() {
    let _this = this;
    let basic = this.props.basic;
    const { active } = basic;
    if (active) this.setState({ activated: true });
    if (!basic) {
      basic = {
        firstname: "test",
        dob: "08/12/1994",
        phonenumber: "+971553818380",
      };
    } else {
      this.setState({ isloggedIn: true });
      this.setState({ dob: basic.dob });
      this.setState({ phonenumber: basic.phonenumber });
      if (basic.avatar_url) {
        const source = { uri: basic.avatar_url };
        this.setState({ ImageSource: source });
      }
      this.setState(basic);
    }
  }
  selectPhotoTapped() {
    let uid = this.props.uid;
    let thisElement = this;
    const options = {
      mediaType: "photo", // 'photo' or 'video'
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection

      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: "images",
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let imgData = {
          image:
            Platform.OS === "android"
              ? response.uri
              : response.uri.replace("file://", ""),
          filePath: response.path,
          fileName: response.fileName,
        };

        //let source = { uri: "data:image/jpeg;base64," + response.data };

        let source = { uri: response.uri };

        thisElement.setState({
          ImageSource: source,
        });
        this.uploadImage(response.uri, uid);
      }
    });
  }
  uploadImage(uri, uid) {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    return ImageResizer.createResizedImage(uri, 300, 300, "JPEG", 80)
      .then((resizedImageUri) => {
        const uploadUri =
          Platform.OS === "ios"
            ? resizedImageUri.uri.replace("file://", "")
            : resizedImageUri.uri;

        let mime = "image/jpg";
        let uploadBlob = null;
        const path = "avatars/";
        const imageRef = Firebase.storage().ref(path).child(`${uid}.jpg`);

        return fs
          .readFile(uploadUri, "base64")
          .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` });
          })
          .then((blob) => {
            uploadBlob = blob;
            return imageRef.put(blob, { contentType: mime });
          })
          .then(() => {
            uploadBlob.close();
            return imageRef.getDownloadURL();
          })
          .then((url) => {
            console.log("url", url);
            window.XMLHttpRequest = tempWindowXMLHttpRequest;
            Firebase.pushProfileImage(uid, url)
              .then((res) => {
                console.log("res", res);
                this.props.dispatch(saveOnboarding(res));
                AsyncStorage.setItem("profile", JSON.stringify(res));
              })
              .catch((err) => {
                console.log("error", err);
              });
          })
          .catch((err) => {
            console.log("error", err);
          });
      })
      .catch((err) => {
        console.log("error", err);
      });
  }
  navigateTo = (page) => {
    this.props.navigation.navigate(page);
  };
  startProfileTest = () => {
    this.setState({ profiletest_webview: true });
  };
  LogOut = () => {
    this.props.dispatch(removeAll());
    AsyncStorage.removeItem("profile");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("petprofile");
    AsyncStorage.removeItem("bikeprofile");
    AsyncStorage.removeItem("healthprofile");
    // console.log("LogOut,AsyncStorage", AsyncStorage.getItem("profile"));
    this.setState({ editable: true, isloggedIn: false });
    setTimeout(() => {
      this.props.navigation.navigate("SignIn");
    }, 1000);
  };
  onLoadFinished = () => {
    const { basic } = this.props;
    if (this.profiletest_webview) {
      console.log("posted message");
      this.profiletest_webview.postMessage(JSON.stringify(basic));
    }
  };
  onEventHandler = (data) => {};
  render() {
    const {
      firstname,
      dob,
      phonenumber,
      activated,
      error_msg,
      profiletest_webview,
    } = this.state;
    let basic = this.props.basic;
    let avatar_url = basic.avatar_url;

    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight,
          flex: 1,
          // backgroundColor: colors.white,
          fontFamily: "Gothic A1",
          marginTop: -60,
        }}
      >
        {profiletest_webview && (
          <WebView
            ref={(r) => (this.profiletest_webview = r)}
            originWhitelist={["*"]}
            source={
              Platform.OS === "ios"
                ? { uri: "./external/profile_test/index.html" }
                : { uri: "file:///android_asset/profile_test/index.html" }
            }
            onMessage={(event) => this.onEventHandler(event.nativeEvent.data)}
            onLoad={this.onLoadFinished}
            startInLoadingState
            javaScriptEnabled
            mixedContentMode="always"
            thirdPartyCookiesEnabled
            allowUniversalAccessFromFileURLs
          />
        )}
        {!profiletest_webview && (
          <KeyboardAwareScrollView
            style={{
              width: "100%",
              height: "100%",
            }}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <View
              style={{
                marginTop: 20,
              }}
            >
              {/* Avatar & Name */}
              <View style={styles.ProfileWrapper}>
                <View style={styles.ProfileInfoHeader}>
                  <Image
                    source={require(`../../../assets/Profile/profile_check.png`)}
                    style={{ width: 30, height: 30, marginRight: 80 }}
                  />
                  <Image
                    source={require(`../../../assets/Profile/flag_uk.png`)}
                    style={{ width: 30, height: 30, marginLeft: 80 }}
                  />
                </View>

                <TouchableOpacity
                  onPress={this.selectPhotoTapped.bind(this)}
                  style={styles.avatar}
                >
                  <ImageBackground
                    style={styles.imageContainer}
                    source={this.state.ImageSource}
                  />
                </TouchableOpacity>

                <Text style={styles.Name}>{firstname}</Text>

                <Text style={styles.Country}>London</Text>
              </View>

              {/* Profile Information */}
              <View style={styles.ProfileWrapper}>
                <View style={styles.Section}>
                  <Image
                    source={require("../../../assets/phone.png")}
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>{phonenumber}</Text>
                </View>

                {/*
                <View style={styles.Section}>
                  <Image
                    source={
                      activated
                        ? require(`../../../assets/activated.png`)
                        : require(`../../../assets/nonactivated.png`)
                    }
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>
                    {activated ? "Active member" : "Non active member"}
                  </Text>
                </View>

                <View style={styles.Section}>
                  <Image
                    source={require("../../../assets/gift.png")}
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>{dob}</Text>
                </View>
                */}

                <View style={styles.Section}>
                  <Image
                    source={require("../../../assets/Profile/heart.png")}
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>Age: 32</Text>
                </View>

                <View style={styles.Section}>
                  <Image
                    source={require("../../../assets/Profile/medal.png")}
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>Entrepreneur</Text>
                </View>

                <View style={styles.Section}>
                  <Image
                    source={require("../../../assets/Profile/superhero.png")}
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>Baking</Text>
                </View>

                <View style={styles.Section}>
                  <Image
                    source={require("../../../assets/Profile/growth.png")}
                    style={styles.SectionImage}
                  />
                  <Text style={styles.ProfileInfoField}>£ 3000</Text>
                </View>
              </View>

              {/* Score */}
              <View style={styles.ScoreWrapper}>
                <View style={styles.ScoreElementWrapper}>
                  <View style={styles.ScoreGrayWrapper}>
                    <Text style={styles.ScoreText}>50</Text>
                    <View style={styles.ScoreGrayIcon}>
                      <Icon
                        style={styles.ScoreIcon}
                        name="person"
                        color="#FFFFFF"
                        size={17}
                      />
                    </View>
                  </View>
                  <Text style={styles.ScoreLabel}>Profile Score</Text>
                </View>
                <View style={styles.ScoreElementWrapper}>
                  <View style={styles.ScoreGreenWrapper}>
                    <Text style={styles.ScoreText}>50</Text>
                    <View style={styles.ScoreGreenIcon}>
                      <Icon
                        style={styles.ScoreIcon}
                        name="leaf"
                        color="#FFFFFF"
                        size={17}
                      />
                    </View>
                  </View>
                  <Text style={styles.ScoreLabel}>Eco Score</Text>
                </View>
                <View style={styles.ScoreElementWrapper}>
                  <View style={styles.ScoreRedWrapper}>
                    <Text style={styles.ScoreText}>50</Text>
                    <View style={styles.ScoreRedIcon}>
                      <Icon
                        style={styles.ScoreIcon}
                        name="heart"
                        color="#FFFFFF"
                        size={17}
                      />
                    </View>
                  </View>
                  <Text style={styles.ScoreLabel}>Social Score</Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Image source={member_img} style={styles.img} />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.Title}> Verified profile</Text>
                <Text style={{ fontSize: 14 }}>
                  Verified ID for extra access
                </Text>
              </View>

              <TouchableOpacity
                style={styles.CallAction}
                onPress={this.startProfileTest}
              >
                <Text style={{ color: colors.darkblue, fontSize: 15 }}>
                  Take Test
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        )}

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleProfile(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image source={home_img} style={{ width: 80, height: 80 }} />
              <Text style={{ textAlign: "center" }}>
                We need to collect some more information from you to create your
                secure account.
              </Text>
              <Text style={{ fontWeight: "700" }}>
                You'll have full access to perks.
              </Text>
              <TouchableHighlight
                onPress={() => {
                  this.toggleProfile(false);
                }}
                style={{
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}
              >
                <Text style={styles.text}>Complete</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.errorVisible}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => this.toggleError(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Image source={error_img} style={{ width: 80, height: 80 }} />
              <Text style={{ fontWeight: "700" }}>Error.</Text>
              <Text style={{ textAlign: "center" }}>{error_msg}</Text>
              <TouchableHighlight
                onPress={() => {
                  this.toggleError(false);
                }}
                style={{
                  backgroundColor: colors.yellow,
                  width: 100,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: colors.grey,
                  borderWidth: 1,
                }}
              >
                <Text style={styles.text}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Title: {
    fontSize: 18,
    fontFamily: "Gothic A1",
    color: colors.darkblue,
    fontWeight: "700",
  },
  CallAction: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  LogOut: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    // display: 'none',
  },
  avatar: {
    top: -30,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    elevation: 3,
    position: "absolute",
  },
  img: {
    width: 40,
    height: 40,
  },
  buttonGroup: {
    width: "90%",
    height: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.white,
  },
  buttonContainer: {
    width: "90%",
    height: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    marginTop: 10,
    display: "none",
  },
  modal: {
    position: "absolute",
    left: "10%",
    top: "20%",
    width: "80%",
    height: "35%",
    justifyContent: "space-around",
    alignItems: "center",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    overflow: "hidden",
    marginBottom: 10,
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 30,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: colors.darkblue,
    borderWidth: 1,
    backgroundColor: colors.lightgrey,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  Section: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 25,
    // width: "100%",
    // backgroundColor: colors.green
  },
  SectionImage: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  ProfileWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white,
    shadowOffset: { height: 2, width: 2 },
    shadowColor: colors.darkblue,
    shadowOpacity: 0.2,
    borderRadius: 15,
  },
  ProfileInfoHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    height: 25,
    width: "100%",
    // backgroundColor: colors.green
  },
  Name: {
    textAlign: "center",
    fontFamily: "Gothic A1",
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 0,
    marginTop: 20,
  },
  Country: {
    textAlign: "center",
    fontFamily: "Gothic A1",
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 5,
    marginTop: 10,
  },
  ProfileInfoField: {
    flex: 1,
    // fontFamily: "Gothic A1",
    fontSize: 15,
    fontWeight: "300",
    fontStyle: "italic",
  },
  // input: {
  //   flex: 1,
  //   paddingRight: 10,
  //   paddingLeft: 10,
  //   paddingBottom: 0,
  //   paddingTop: 0,
  //   fontSize: 20
  // }
  ScoreWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 5,
  },
  ScoreElementWrapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  ScoreGrayWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#BEBEBE",
    // display: 'flex',
    // position: 'relative',
  },
  ScoreGreenWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#9BCCB4",
  },
  ScoreRedWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#F2AAAA",
  },
  ScoreText: {
    fontSize: 17,
    fontWeight: "300",
  },
  ScoreLabel: {
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    marginTop: 15,
  },
  ScoreGrayIcon: {
    bottom: -12,
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BEBEBE",
    position: "absolute",
  },
  ScoreGreenIcon: {
    bottom: -12,
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9BCCB4",
    position: "absolute",
  },
  ScoreRedIcon: {
    bottom: -12,
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2AAAA",
    position: "absolute",
  },
  ScoreIcon: {},
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
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PersonalProfile);
