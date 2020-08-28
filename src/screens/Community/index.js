import React, { Component } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Feed from "./Feed/index";
import Users from "./Users";
import Message from "./Message/index";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Header from "./component/Header";
import colors from "../../theme/Colors";
class Community extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "Feeds"
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
    }
  };
  setScreen = screen => {
    const { uid } = this.props;
    switch (screen) {
      case "Feeds":
        return <Feed uid={uid} />;
        break;
      case "Friends":
        return <Users uid={uid} />;
        break;
      case "Messages":
        return <Message uid={uid} />;
        break;
      default:
        return <Message />;
    }
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { screen } = this.state;
    console.log('screen', screen);
    return (
      // <KeyboardAwareScrollView style={{ width: Metrics.screenWidth }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: colors.white
        }}
      >
        <TouchableOpacity style={styles.back_button} onPress={this.goBack}>
          <Image
            style={styles.tabbutton}
            source={require('../../assets/back.png')}
          />
        </TouchableOpacity>
        <TopImage />
        <Logo />
        <Header onTap={this.onTap} />
        <View
          style={{
            flex: 1,
            marginTop: 180,
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
const styles = StyleSheet.create({
  back_button: {
    position: 'absolute',
    top: 45,
    left: 10,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-start',
  },
  tabbutton: {
    width: 25,
    height: 25,
  },
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    basic: state.basic,
    uid: state.uid
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Community);

// export default StackNavigator;
