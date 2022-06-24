import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Firebase from "../../firebasehelper";
import colors from "../../theme/Colors";
import Logo from "../../components/Logo";
import PhoneInput from "react-native-phone-number-input";
import CardView from "react-native-cardview";
import Metrics from "../../theme/Metrics";
import { doSMS } from "../../functions/Auth";
import useDebounce from "../../hooks/useDebounce";

const SignIn = () => {
  const [value, setValue] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [userData, setUserData] = useState(null);
  const [isCustomerSearching, setIsSearching] = useState(false);
  const debouncedCustomeriD = useDebounce(customerID, 500);
  const phoneInput = useRef(null);
  const navigation = useNavigation();

  const isValidCustomer =
    (debouncedCustomeriD && userData) || !debouncedCustomeriD;
  useEffect(
    () => {
      if (debouncedCustomeriD) {
        setIsSearching(true);
        Firebase.getUserDatafromUID(debouncedCustomeriD).then((result) => {
          setIsSearching(false);
          console.log("result", result);
          if (result) setUserData(result);
          else setUserData(null);
        });
      } else {
        setIsSearching(false);
      }
    },
    [debouncedCustomeriD] // Only call effect if debounced search term changes
  );
  const createPincode = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };
  const navigateTo = (page, props) => {
    navigation.navigate(page, props);
  };
  const signIn = () => {
    const checkValid = phoneInput.current.isValidNumber(value);
    const number = phoneInput.current.getNumberAfterPossiblyEliminatingZero();
    const phoneNumber = number.formattedNumber;
    if (checkValid) {
      let pin = createPincode();
      pin = pin.toString();
      console.log("/// pin", pin);
      doSMS(phoneNumber, pin, "UHSM");
      navigateTo("PhoneCode", {
        phone: phoneNumber,
        pin: pin,
        customerData: userData
          ? { ...userData, uid: debouncedCustomeriD }
          : null,
      });
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
        Welcome
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
      {isCustomerSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isValidCustomer ? (
        <TouchableOpacity
          onPress={signIn}
          style={[
            styles.CallAction,
            {
              backgroundColor:
                value.length === 10 ? colors.primary : colors.grey,
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
      ) : (
        <Text
          style={{
            position: "absolute",
            top: 400,
            fontSize: 16,
            fontWeight: "500",
            color: "red",
            textAlign: "center",
          }}
        >
          Sorry, your given customeriD is not valid
        </Text>
      )}
      <View style={styles.iDContainer}>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          Activate account
        </Text>
        <CardView
          style={{
            backgroundColor: "white",
            padding: 10,
            marginTop: 20,
            marginBottom: 20,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={5}
        >
          <TextInput
            style={{
              width: "80%",
              fontSize: 17,
            }}
            onChangeText={setCustomerID}
            value={customerID}
            placeholder="Enter uhsm customer iD"
          />
        </CardView>
        <Text style={{ fontSize: 16, fontWeight: "300", textAlign: "center" }}>
          Register for mobile sign in {"\n"}with a few simple steps
        </Text>
      </View>
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
  iDContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 500,
    padding: 30,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    top: 400,
    zIndex: 100,
  },
});
export default SignIn;
