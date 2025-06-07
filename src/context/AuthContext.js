"use client"

import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { auth } from "../services/firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Crear el contexto de autenticación con un valor por defecto más completo
export const AuthContext = createContext({
  user: null,
  userType: null,
  loading: true,
  userTokens: 0,
  updateUserTokens: (amount, operation = "add") => {
    console.warn("updateUserTokens called outside of AuthProvider: ", amount, operation)
  },
  saveUserType: async (type) => {
    console.warn("saveUserType called outside of AuthProvider: ", type)
  },
  logout: async () => {
    console.warn("logout called outside of AuthProvider")
  },
})

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null) // "consumer" o "model"
  const [loading, setLoading] = useState(true)
  const [userTokens, setUserTokens] = useState(0)

  const updateUserTokens = useCallback((amount, operation = "add") => {
    setUserTokens((prevTokens) => {
      if (operation === "add") {
        return prevTokens + amount
      } else if (operation === "subtract") {
        return Math.max(0, prevTokens - amount)
      } else if (operation === "set") {
        return amount
      }
      return prevTokens // Default case, though should not be hit with current logic
    })
  }, [])

  // Efecto para verificar el estado de autenticación al cargar la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        // TODO: Fetch initial tokens from Firestore for the logged-in user
        // For now, setting a default or previously fetched value if available
        // Example: fetchUserTokensFromDB(currentUser.uid).then(setUserTokens);
        updateUserTokens(5000, "set") // Mock initial tokens

        try {
          const storedUserType = await AsyncStorage.getItem("userType")
          if (storedUserType) {
            setUserType(storedUserType)
          } else {
            setUserType("consumer") // Default
          }
        } catch (error) {
          console.error("Error al recuperar el tipo de usuario:", error)
          setUserType("consumer") // Default on error
        }
      } else {
        setUser(null)
        setUserType(null)
        updateUserTokens(0, "set") // Reset tokens on logout
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [updateUserTokens]) // Add updateUserTokens to dependency array

  const saveUserType = useCallback(async (type) => {
    try {
      await AsyncStorage.setItem("userType", type)
      setUserType(type)
    } catch (error) {
      console.error("Error al guardar el tipo de usuario:", error)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
      await AsyncStorage.removeItem("userType")
      // setUser(null); // Handled by onAuthStateChanged
      // setUserType(null); // Handled by onAuthStateChanged
      // updateUserTokens(0, "set"); // Handled by onAuthStateChanged
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }, [])

  const value = {
    user,
    userType,
    loading,
    userTokens,
    updateUserTokens, // Ensure this is the function defined with useCallback
    saveUserType,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext)
}
