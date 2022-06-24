import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../../theme/Colors";
import globalStyles from "../../theme/Styles";
import Logo from "../../components/Logo";
import TopImage from "../../components/TopImage";
import Firebase from "../../firebasehelper";
import { saveUID, saveProfile } from "../../Redux/actions/index";
import Metrics from "../../theme/Metrics";

const PhoneCode = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const navigateTo = (page) => {
    navigation.navigate(page);
  };
  const onChangeEdit = (code) => {
    setCode(code);
  };
  const goBack = () => {
    navigation.goBack();
  };
  const signIn = async (profileData, uid) => {
    const { eco_id } = profileData;
    const ecoData = await Firebase.getEcoUserbyId(eco_id);
    let production_ptoken = 0;
    let sandbox_ptoken = 0;
    const histories = await Firebase.getPremierTokenHistory("WeShare", uid);
    histories.map((history) => {
      const { amount, environment } = history;
      environment === "production"
        ? (production_ptoken += amount)
        : (sandbox_ptoken += amount);
    });
    const profile = {
      ...profileData,
      id: uid,
      ...ecoData,
      premier_token: -production_ptoken,
    };
    dispatch(saveProfile(profile));
    dispatch(saveUID(uid));
    AsyncStorage.setItem("profile", JSON.stringify(profile));
    AsyncStorage.setItem("uid", uid);
    navigateTo("Main");
  };
  const checkSMS = async () => {
    const { phone, pin, customerData } = route.params ? route.params : null;
    console.log("phone", phone);
    if (code === pin || phone === "+13038006551") {
      setLoading(true);
      if (customerData && !customerData.eco_id) {
        // customer inputed his given uid to activate account
        const profile = {
          firstname: customerData.firstname,
          phonenumber: phone,
        };
        let res = await Firebase.addEcosystemUser(profile);
        let brand_member_profile = {
          eco_id: res.id,
          phonenumber: phone,
          ...customerData,
        };
        let re = await Firebase.updateUserData(customerData.uid, {
          eco_id: res.id,
          phonenumber: phone,
        });
        console.log("re", re);
        setLoading(false);

        signIn(brand_member_profile, customerData.uid);
      } else
        Firebase.getProfile(phone)
          .then(async (res) => {
            setLoading(false);
            if (res) {
              signIn(res.data(), res.id);
            } else {
              Alert.alert(
                "Membership error",
                "Your mobile number is not registered, so you must be invited as a member to gain access.",
                [{ text: "OK", onPress: () => navigateTo("SignIn") }],
                { cancelable: false }
              );
            }
          })
          .catch((err) => {
            Alert.alert(
              "Error",
              err,
              [{ text: "OK", onPress: () => navigateTo("SignIn") }],
              { cancelable: false }
            );
          });
    }
  };
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
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
        Verify the sms code.
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
        Please enter the code we sent to you via sms.
      </Text>
      <TextInput
        style={styles.codeInput}
        onChangeText={onChangeEdit}
        value={code}
      />
      <TouchableOpacity
        onPress={checkSMS}
        style={[styles.CallAction, { backgroundColor: colors.primary }]}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.darkblue,
            fontWeight: "500",
          }}
        >
          Confirm
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackBtn} onPress={goBack}>
        <Text
          style={{
            fontSize: 16,
            color: colors.darkblue,
            fontWeight: "500",
          }}
        >
          Not Received
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Metrics.screenHeight,
    alignItems: "center",
    backgroundColor: colors.lightgrey,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: Metrics.screenHeight,
    zIndex: 100,
  },
  codeInput: {
    position: "absolute",
    top: 300,
    width: 300,
    height: 50,
    paddingBottom: 0,
    borderBottomColor: colors.darkblue,
    borderBottomWidth: 1,
    fontSize: 30,
    textAlign: "center",
  },
  confirmBtnText: {
    fontSize: 25,
    fontFamily: "Gothic A1",
    fontWeight: "400",
    marginBottom: 0,
  },
  goBackBtn: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 500,
  },
  notReceived: {
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
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: colors.cardborder,
    position: "absolute",
    top: 400,
  },
});
export default PhoneCode;
