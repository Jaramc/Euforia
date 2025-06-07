"use client"
import { Text, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useRoute } from "@react-navigation/native" // To get route name
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import colors from "../constants/colors"
import { useAuth } from "../context/AuthContext"

const UserScreen = () => {
  const route = useRoute()
  const { userType, userTokens } = useAuth() // Get tokens from context

  // --- DIAGNOSTIC LOG ---
  // This will print in your Metro server console every time the component renders.
  console.log(`UserScreen is rendering. Current token balance: ${userTokens}`)
  // --------------------

  let title = "Explorar"
  let iconName = "people-outline"

  if (userType === "consumer") {
    title = "Cerca de Ti"
    iconName = "navigate-circle-outline"
  } else if (userType === "model") {
    title = "Mis Clientes"
    iconName = "people-circle-outline"
  }

  return (
    <LinearGradient colors={colors.gradienteFondoOscuro} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {userType === "consumer" && (
          <View style={styles.tokenBalanceContainer}>
            <Icon name="coin" size={20} color="#FFD700" />
            <Text style={styles.tokenBalanceText}>{userTokens}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Ionicons name={iconName} size={80} color={colors.luminousOpacity} />
        <Text style={styles.placeholderText}>Funcionalidad de "{title}" estará disponible pronto.</Text>
        <Text style={styles.subPlaceholderText}>
          Aquí podrás{" "}
          {userType === "consumer"
            ? "descubrir modelos y usuarios cerca de tu ubicación."
            : "ver y gestionar tu lista de clientes y suscriptores."}
        </Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    color: colors.luminous,
    fontWeight: "bold",
  },
  tokenBalanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tokenBalanceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: colors.luminous,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subPlaceholderText: {
    fontSize: 14,
    color: colors.luminousOpacity,
    textAlign: "center",
    maxWidth: "80%",
  },
})

export default UserScreen
