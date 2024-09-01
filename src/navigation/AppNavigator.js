import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import GetStartedScreen from "../screens/GetStarted";
import HomeScreen from "../screens/HomeScreen";
import StockDetailScreen from "../screens/StockDetailScreen";
import WatchlistScreen from "../screens/WatchlistScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import { useTheme } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        { backgroundColor: isDarkMode ? "#1C1C1E" : "#F2F2F7" },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
          >
            <MaterialIcons
              name={options.tabBarIcon({ focused: isFocused }).props.name}
              size={24}
              color={isFocused ? "#4CAF50" : isDarkMode ? "#8E8E93" : "#3C3C43"}
              style={isFocused ? styles.focusedIcon : null}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabNavigator = () => {
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Watchlist") {
            iconName = "star";
          } else if (route.name === "Portfolio") {
            iconName = "account-balance";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: isDarkMode ? "#1C1C1E" : "#F2F2F7",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
         
        },
        headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Market Overview",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          title: "My Watchlist",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          title: "My Portfolio",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="StockDetailScreen" component={StockDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 75,
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  focusedIcon: {
    transform: [{ scale: 1.8 }],
  },
});

export default AppNavigator;
