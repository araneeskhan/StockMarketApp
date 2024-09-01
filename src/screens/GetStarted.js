import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

const GetStarted = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>StockTrack Pro</Text>
        <View style={styles.logoContainer}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
        </View>
        <Text style={styles.subtitle}>Track, analyze, and manage your investments with ease</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by real-time market data</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2a3a',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  title: {
    fontSize: responsiveFontSize(4.5),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: responsiveFontSize(2),
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(10),
  },
  logoContainer: {
    marginVertical: responsiveHeight(5),
  },
  logo: {
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    resizeMode: 'contain',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#4CAF50",
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(8),
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    fontSize: responsiveFontSize(2.5),
    color: "white",
    marginRight: responsiveWidth(2),
    fontWeight: '600',
  },
  footer: {
    paddingBottom: responsiveHeight(3),
    alignItems: 'center',
  },
  footerText: {
    fontSize: responsiveFontSize(1.5),
    color: '#a0a0a0',
  },
});

export default GetStarted;