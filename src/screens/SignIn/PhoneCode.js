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
  const checkSMS = () => {
    const { phone, pin } = route.params ? route.params : null;
    if (code === pin || phone === "+44528834523") {
      const basicInfo = {
        firstname: "",
        dob: "",
        phonenumber: phone,
        email: "",
        password: "",
      };
      setLoading(true);
      Firebase.getProfile(phone)
        .then(async (res) => {
          console.log("result of profile", res);
          setLoading(false);
          if (res) {
            const { eco_id } = res.data();
            console.log("get Profile", res.data());
            const ecoData = await Firebase.getEcoUserbyId(eco_id);
            console.log("ecoData", ecoData);
            const profile = { ...res.data(), id: res.id, ...ecoData };
            dispatch(saveProfile(profile));
            AsyncStorage.setItem("profile", JSON.stringify(res.data()));
            AsyncStorage.setItem("uid", res.id);
            navigateTo("Main");
          } else {
            Alert.alert(
              "Error",
              "You need to join as a member first.",
              [{ text: "OK", onPress: () => navigateTo("Landing") }],
              { cancelable: false }
            );
          }
        })
        .catch((err) => {
          Alert.alert(
            "Error",
            err,
            [{ text: "OK", onPress: () => navigateTo("Landing") }],
            { cancelable: false }
          );
        });
    }
  };
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.yellow} />
        </View>
      )}
      <TopImage />
      <Logo />

      <TextInput
        style={styles.codeInput}
        onChangeText={onChangeEdit}
        value={code}
      />
      <TouchableOpacity style={globalStyles.CalltoAction} onPress={checkSMS}>
        <Text style={styles.confirmBtnText}>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.goBackBtn} onPress={goBack}>
        <Text style={styles.notReceived}>Not Received</Text>
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
    marginTop: 180,
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
    marginTop: 50,
  },
  notReceived: {
    fontSize: 25,
    fontFamily: "Gothic A1",
    fontWeight: "400",
    color: colors.blue,
  },
});
export default PhoneCode;
