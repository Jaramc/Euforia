"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { auth } from "../services/firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Crear el contexto de autenticación
export const AuthContext = createContext()

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null) // "consumer" o "model"
  const [loading, setLoading] = useState(true)

  // Efecto para verificar el estado de autenticación al cargar la app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        // Recuperar el tipo de usuario de AsyncStorage
        try {
          const storedUserType = await AsyncStorage.getItem("userType")
          console.log("Tipo de usuario recuperado:", storedUserType)

          if (storedUserType) {
            setUserType(storedUserType)
          } else {
            // Si no hay tipo guardado, asumimos que es consumidor por defecto
            console.log("No se encontró tipo de usuario, usando valor por defecto: consumer")
            setUserType("consumer")
          }
        } catch (error) {
          console.error("Error al recuperar el tipo de usuario:", error)
          setUserType("consumer") // Valor por defecto
        }
      } else {
        setUser(null)
        setUserType(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Función para guardar el tipo de usuario
  const saveUserType = async (type) => {
    try {
      await AsyncStorage.setItem("userType", type)
      setUserType(type)
    } catch (error) {
      console.error("Error al guardar el tipo de usuario:", error)
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth)
      await AsyncStorage.removeItem("userType") // Limpiar el tipo de usuario al cerrar sesión
      setUser(null)
      setUserType(null)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Valor del contexto
  const value = {
    user,
    userType,
    loading,
    saveUserType,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext)
}
