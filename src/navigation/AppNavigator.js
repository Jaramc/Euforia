"use client"

import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { View, Text, StyleSheet, Platform, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import HomeScreen from "../screens/HomeScreen"
import ModelHomeScreen from "../screens/ModelHomeScreen"
import ModelMessagesScreen from "../screens/ModelMessagesScreen" // Importar la nueva pantalla de mensajes
import UserScreen from "../screens/UserScreen"
import MilistScreen from "../screens/MilistScreen"
import MyAccountScreen from "../screens/MyAccountScreen"
import RegisterScreen from "../screens/RegisterScreen"
import colors from "../constants/colors"
import { useAuth } from "../context/AuthContext"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Componente personalizado para el ícono de la pestaña con animación y badge
class AnimatedTabBarIcon extends React.Component {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(1)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.focused !== this.props.focused && this.props.focused) {
      this.startAnimation()
    }
  }

  startAnimation() {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  render() {
    const { name, color, focused, badgeCount = 0 } = this.props

    return (
      <View style={styles.tabIconContainer}>
        <Animated.View
          style={{
            transform: [{ scale: this.animatedValue }],
          }}
        >
          <Ionicons name={name} size={24} color={color} />
        </Animated.View>

        {badgeCount > 0 && (
          <View style={[styles.badgeContainer, { backgroundColor: focused ? colors.error : "rgba(255, 69, 58, 0.8)" }]}>
            <Text style={styles.badgeText}>{badgeCount > 9 ? "9+" : badgeCount}</Text>
          </View>
        )}
      </View>
    )
  }
}

// Componente personalizado para el fondo de la pestaña activa
const TabBarBackground = ({ focused }) => {
  if (!focused) return null

  return (
    <LinearGradient
      colors={[colors.principal, colors.variante7]}
      style={styles.activeTabBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  )
}

// Definición de MainTabNavigator con estilos mejorados para usuarios consumidores
const ConsumerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="💕Chats💕"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName
          let badgeCount = 0

          if (route.name === "💕Chats💕") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline"
            badgeCount = 5
          } else if (route.name === "Cerca de ti😶‍🌫️") {
            iconName = focused ? "location" : "location-outline"
            badgeCount = 2
          } else if (route.name === "Mas destacado⭐") {
            iconName = focused ? "star" : "star-outline"
          } else if (route.name === "Mi cuenta") {
            iconName = focused ? "person" : "person-outline"
          }

          return (
            <View style={styles.tabItemContainer}>
              <TabBarBackground focused={focused} />
              <AnimatedTabBarIcon
                name={iconName}
                color={focused ? "#fff" : "rgba(255, 255, 255, 0.6)"}
                focused={focused}
                badgeCount={badgeCount}
              />
            </View>
          )
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          elevation: 8,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(30, 30, 45, 0.95)", "rgba(20, 20, 35, 0.98)"]}
            style={{ height: "100%" }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="💕Chats💕"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Chats</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cerca de ti😶‍🌫️"
        component={UserScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Cerca</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Mas destacado⭐"
        component={MilistScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Destacados</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Mi cuenta"
        component={MyAccountScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Perfil</Text>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// Definición de ModelTabNavigator para modelos
const ModelTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Panel"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName
          let badgeCount = 0

          if (route.name === "Panel") {
            iconName = focused ? "home" : "home-outline"
            badgeCount = 3
          } else if (route.name === "Mensajes") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline"
            badgeCount = 5
          } else if (route.name === "Clientes") {
            iconName = focused ? "people" : "people-outline"
          } else if (route.name === "Mi cuenta") {
            iconName = focused ? "person" : "person-outline"
          }

          return (
            <View style={styles.tabItemContainer}>
              <TabBarBackground focused={focused} />
              <AnimatedTabBarIcon
                name={iconName}
                color={focused ? "#fff" : "rgba(255, 255, 255, 0.6)"}
                focused={focused}
                badgeCount={badgeCount}
              />
            </View>
          )
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          elevation: 8,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["rgba(30, 30, 45, 0.95)", "rgba(20, 20, 35, 0.98)"]}
            style={{ height: "100%" }}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Panel"
        component={ModelHomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Panel</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Mensajes"
        component={ModelMessagesScreen} // Usar la nueva pantalla específica para mensajes
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Mensajes</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Clientes"
        component={UserScreen} // Puedes crear una pantalla específica para clientes de modelos
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Clientes</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Mi cuenta"
        component={MyAccountScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>Perfil</Text>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// Componente principal de navegación que decide qué navegador mostrar según el tipo de usuario
const MainNavigator = () => {
  const { userType } = useAuth()

  console.log("MainNavigator - Tipo de usuario actual:", userType)

  // Mostrar diferentes navegadores según el tipo de usuario
  if (userType === "model") {
    console.log("Mostrando navegador para modelos")
    return <ModelTabNavigator />
  } else {
    console.log("Mostrando navegador para consumidores")
    return <ConsumerTabNavigator />
  }
}

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  tabIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
  },
  badgeContainer: {
    position: "absolute",
    top: -6,
    right: -10,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "rgba(20, 20, 35, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 60,
    borderRadius: 20,
    overflow: "hidden",
  },
  activeTabBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    opacity: 0.9,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  tabBarLabelFocused: {
    color: "#fff",
    fontWeight: "700",
  },
})

export default AppNavigator
