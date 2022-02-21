import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../theme/Colors";
import globalStyles from "../../theme/Styles";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import PhoneInput from "react-native-phone-number-input";
// import PhoneInput from "react-native-phone-input";
import Metrics from "../../theme/Metrics";
import { doSMS } from "../../functions/Auth";
const SignIn = () => {
  const [value, setValue] = useState("");
  const phoneInput = useRef(null);
  const navigation = useNavigation();
  const createPincode = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };
  const navigateTo = (page, props) => {
    navigation.navigate(page, props);
  };
  const goBack = () => {
    navigateTo("Landing");
  };
  const signIn = () => {
    const checkValid = phoneInput.current.isValidNumber(value);
    const number = phoneInput.current.getNumberAfterPossiblyEliminatingZero();
    const phoneNumber = number.formattedNumber;
    if (checkValid) {
      console.log("phoneNumber", phoneNumber);
      let pin = createPincode();
      pin = pin.toString();
      console.log("/// pin", pin);
      if (phoneNumber !== "+13038006551") doSMS(phoneNumber, pin, "WeShare");
      navigateTo("PhoneCode", { phone: phoneNumber, pin: pin });
    } else {
      Alert.alert("Error", "", [{ text: "OK" }], { cancelable: false });
    }
  };
  return (
    <View style={styles.container}>
      <Logo />
      <Text
        style={{
          fontSize: 25,
          color: colors.darkblue,
          fontWeight: "500",
          position: "absolute",
          top: 170,
        }}
      >
        Welcome back.
      </Text>
      <Text
        style={{
          width: "70%",
          fontSize: 17,
          color: colors.darkblue,
          fontWeight: "500",
          position: "absolute",
          top: 210,
          textAlign: "center",
        }}
      >
        Please enter your cell number, to verify yourself.
      </Text>
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="US"
        onChangeText={(text) => {
          setValue(text);
        }}
        containerStyle={{
          position: "absolute",
          top: 300,
        }}
        withDarkTheme
        withShadow
        autoFocus
      />
      <TouchableOpacity
        onPress={signIn}
        style={[
          styles.CallAction,
          {
            backgroundColor: value.length === 10 ? colors.primary : colors.grey,
          },
        ]}
        disabled={value.length !== 10}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.darkblue,
            fontWeight: "500",
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Text
          style={{
            fontSize: 16,
            color: colors.darkblue,
            fontWeight: "500",
          }}
        >
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    height: Metrics.screenHeight,
    alignItems: "center",
    backgroundColor: colors.lightgrey,
  },
  phoneInputContainer: {
    marginTop: 180,
    width: 300,
    height: 50,
    borderBottomColor: colors.darkblue,
    borderBottomWidth: 1,
  },
  phoneInputTextStyle: {
    fontSize: 25,
    fontFamily: "Gothic A1",
    height: 30,
  },
  signInText: {
    fontSize: 25,
    fontFamily: "Gothic A1",
    fontWeight: "400",
    marginBottom: 0,
  },
  goBackButton: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 500,
  },
  goBackText: {
    fontSize: 25,
    fontFamily: "Gothic A1",
    fontWeight: "400",
    color: colors.blue,
  },
  CallAction: {
    width: 230,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
    paddingTop: 10,
    paddingBottom: 10,
    position: "absolute",
    top: 400,
  },
});
export default SignIn;
