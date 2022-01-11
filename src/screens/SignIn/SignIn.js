import React, { useState, useRef } from "react";
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
import { clearZero } from "../../utils/functions";
const SignIn = () => {
  const [value, setValue] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
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
    let pin = createPincode();
    pin = pin.toString();
    console.log("/// pin", pin);

    console.log("/// phonenumber", phoneNumber);

    doSMS(phoneNumber, pin, "WeShare");

    navigateTo("PhoneCode", { phone: phoneNumber, pin: pin });
  };
  return (
    <View style={styles.container}>
      <TopImage />
      <Logo />
      <PhoneInput
        ref={phoneInput}
        defaultValue={value}
        defaultCode="US"
        onChangeText={(text) => {
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setphoneNumber(text);
        }}
        containerStyle={{ marginTop: 50 }}
        withDarkTheme
        withShadow
        autoFocus
      />
      <TouchableOpacity style={globalStyles.CalltoAction} onPress={signIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <Text style={styles.goBackText}>Back</Text>
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
});
export default SignIn;
