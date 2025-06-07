"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../services/firebaseConfig"
import colors from "../constants/colors"
import { useAuth } from "../context/AuthContext"

const LoginScreen = ({ navigation }) => {
  const { saveUserType } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    // Limpiar error previo
    setErrorMessage("")

    // Validación básica
    if (!email || !password) {
      setErrorMessage("Por favor, ingresa tu correo y contraseña")
      return
    }

    // Iniciar proceso de inicio de sesión
    setIsLoading(true)

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Usuario autenticado correctamente
        const user = userCredential.user
        console.log("Usuario autenticado:", user)

        // No sobrescribimos el tipo de usuario aquí
        // El tipo de usuario ya debería estar guardado en AsyncStorage desde el registro
        // o se recuperará automáticamente en el AuthContext

        setIsLoading(false)
        navigation.replace("MainTabs")
      })
      .catch((error) => {
        setIsLoading(false)

        // Mensajes de error más amigables
        if (error.code === "auth/invalid-email") {
          setErrorMessage("El formato del correo electrónico no es válido")
        } else if (error.code === "auth/user-not-found") {
          setErrorMessage("No existe una cuenta con este correo electrónico")
        } else if (error.code === "auth/wrong-password") {
          setErrorMessage("Contraseña incorrecta")
        } else if (error.code === "auth/too-many-requests") {
          setErrorMessage("Demasiados intentos fallidos. Intenta más tarde")
        } else {
          setErrorMessage("Error al iniciar sesión: " + error.message)
        }
      })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradientePrimario} style={styles.gradientBackground}>
        <View style={styles.content}>
          {/* Logo y título */}
          <View style={styles.headerContainer}>
            <Image source={require("../../assets/imagenlogo.jpg")} style={styles.logo} />
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </View>

          {/* Formulario de inicio de sesión */}
          <View style={styles.formContainer}>
            {/* Input de email */}
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Input de contraseña */}
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
                <Icon name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Enlace para recuperar contraseña */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Mensaje de error */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <LinearGradient
                  colors={["#FF4D4F", "#D72638"]}
                  style={styles.errorGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Icon
                    name={
                      errorMessage.includes("correo")
                        ? "email-alert"
                        : errorMessage.includes("contraseña")
                          ? "lock-alert"
                          : "alert-circle"
                    }
                    size={22}
                    color="#fff"
                    style={styles.errorIcon}
                  />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </LinearGradient>
              </View>
            ) : null}

            {/* Botón de inicio de sesión */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.principal, colors.variante7]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    <Icon name="login" size={20} color="#fff" style={styles.loginIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>O</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Botones de inicio de sesión con redes sociales */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Icon name="google" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Icon name="facebook" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Icon name="apple" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Enlace a registro - Estilo similar al de la imagen */}
            <View style={styles.loginSectionContainer}>
              <LinearGradient
                colors={["rgba(180, 60, 220, 0.8)", "rgba(150, 30, 180, 0.9)"]}
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.loginContent}>
                  <View style={styles.loginTextContainer}>
                    <Text style={styles.loginQuestion}>¿No tienes una cuenta?</Text>
                    <Text style={styles.loginSubtext}>Regístrate para comenzar</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate("Register")}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)"]}
                      style={styles.loginButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.loginButtonText}>Registrarse</Text>
                      <Icon name="arrow-right" size={18} color="#fff" style={styles.loginIcon} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#fff",
  },
  eyeButton: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  errorGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  errorIcon: {
    marginRight: 10,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  loginButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonGradient: {
    flexDirection: "row",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  loginIcon: {
    marginLeft: 5,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  separatorText: {
    color: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  // Estilos para la sección de registro similar a la imagen
  loginSectionContainer: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 10,
  },
  loginGradient: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  loginContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loginTextContainer: {
    flex: 1,
  },
  loginQuestion: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    marginTop: 2,
  },
  loginButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 0, // Anular el margen inferior para este botón específico
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
})

export default LoginScreen
