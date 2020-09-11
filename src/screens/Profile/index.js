import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PersonalProfile from "./Personal";
import GroupProfile from "./Group";
import HealthProfile from "./Health";
import PetsProfile from "./Pets";
import TravelProfile from "./Travel";
import SubscriptionProfile from "./Subscriptions";
import Timeline from "./Timeline";
import Logo from "../../components/Logo";
import TopImage from "./component/TopImage";
import Header from "../../components/Header";
import { Metrics } from "../../theme";
import colors from "../../theme/Colors";
import { saveScreen, removeAll } from "../../Redux/actions";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Personal"
    };
  }
  onTap = screen => {
    console.log(screen);
    this.setState({ screen: screen });
  };
  componentDidMount = () => {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  };
  load = () => {
    const { route } = this.props;
    if (route.params) {      
      const { page } = route.params;
      console.log("page", page);
      this.setState({ screen: page });
      this.props.dispatch(saveScreen(page));
    }
  };
  LogOut = () => {
    // this.props.navigation.navigate("Landing");
    this.props.dispatch(removeAll());
    AsyncStorage.removeItem("profile");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("petprofile");
    AsyncStorage.removeItem("bikeprofile");
    AsyncStorage.removeItem("healthprofile");
    // console.log("LogOut,AsyncStorage", AsyncStorage.getItem("profile"));
    this.setState({ editable: true, isloggedIn: false });
    setTimeout(() => {
      this.props.navigation.navigate("Landing");
    }, 1000);
  };
  setScreen = screen => {
    switch (screen) {
      case "Personal":
        return <PersonalProfile navigation={this.props.navigation} />;
        break;
      case "Groups":
        return <GroupProfile navigation={this.props.navigation} />;
        break;
      case "Health":
        return <HealthProfile navigation={this.props.navigation} />;
        break;
      case "Pets":
        return <PetsProfile navigation={this.props.navigation} />;
        break;
      case "Timeline":
        return <Timeline navigation={this.props.navigation} />;
        break;
      case "Subscriptions":
        return <SubscriptionProfile navigation={this.props.navigation} />;
        break;
      case "Travel":
        return <TravelProfile navigation={this.props.navigation} />;
        break;
      default:
        return <PersonalProfile navigation={this.props.navigation} />;
    }
  };
  render() {
    const { screen } = this.state;
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.white
        }}
      >
        <TopImage screen={screen} onLogout={this.LogOut} />
        <Logo />
        
        {/*<Header onTap={this.onTap} />*/}
        <View
          style={{
            flex: 1,
            marginTop: 150,
            width: "100%"
          }}
        >
          {this.setScreen(screen)}
        </View>
      </View>
      // </KeyboardAwareScrollView>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
    screen: state.screen
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

// export default StackNavigator;

const styles = StyleSheet.create({
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
    backgroundColor: colors.green,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 3,
    // display: 'none',
  },
});