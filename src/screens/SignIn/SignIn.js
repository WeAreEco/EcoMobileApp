import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
  const [countryCode, setCountryCode] = useState("1");
  const [phoneNumber, setphoneNumber] = useState("");
  const phoneInput = useRef(null);
  const navigation = useNavigation();
  useEffect(() => {
    const phone = "+" + countryCode + value;
    setphoneNumber(phone);
  }, [countryCode, value]);
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
    let pin = createPincode();
    pin = pin.toString();
    console.log("/// pin", pin);
    if (phoneNumber !== "+13038006551") doSMS(phoneNumber, pin, "WeShare");
    navigateTo("PhoneCode", { phone: phoneNumber, pin: pin });
  };
  return (
    <View style={styles.container}>
      <Logo />
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="US"
        onChangeText={(text) => {
          if (text.charAt(0) === "0") setValue(text.replace("0", ""));
          else setValue(text);
        }}
        onChangeCountry={(country) => setCountryCode(country.callingCode)}
        containerStyle={{ marginTop: 170 }}
        withDarkTheme
        withShadow
        autoFocus
      />
      <TouchableOpacity
        onPress={signIn}
        style={[styles.CallAction, { backgroundColor: colors.primary }]}
      >
        <Text
          style={{
            fontSize: 16,
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
    marginTop: 50,
  },
  goBackText: {
    fontSize: 25,
    fontFamily: "Gothic A1",
    fontWeight: "400",
    color: colors.blue,
  },
  CallAction: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.cardborder,
    marginTop: 50,
  },
});
export default SignIn;
