"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../services/firebaseConfig"
import colors from "../constants/colors"
import { useAuth } from "../context/AuthContext" // Importar el contexto de autenticación

const { width } = Dimensions.get("window")

const RegisterScreen = ({ navigation }) => {
  const { saveUserType } = useAuth() // Obtener la función para guardar el tipo de usuario

  // Estado para el tipo de registro (consumidor o modelo)
  const [registerType, setRegisterType] = useState("consumer") // "consumer" o "model"

  // Estados para los campos del formulario
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para la visibilidad de contraseñas
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  // Estado para el modal de preferencias
  const [modalVisible, setModalVisible] = useState(false)

  // Detectar si estamos en web
  const isWeb = Platform.OS === "web"

  // Lista de todas las preferencias disponibles con iconos
  const availablePreferences = [
    { id: "citas", label: "Citas", icon: "heart" },
    { id: "amistad", label: "Amistad", icon: "handshake" },
    { id: "relacion", label: "Relación seria", icon: "ring" },
    { id: "casual", label: "Encuentros casuales", icon: "glass-cocktail" },
    { id: "bondage", label: "Bondage", icon: "link-variant" },
    { id: "culonas", label: "Culonas", icon: "human-female-dance" },
    { id: "tetona", label: "Tetonas", icon: "human-female" },
    { id: "bdsm", label: "BDSM", icon: "lock" },
    { id: "fetiches", label: "Fetiches", icon: "shoe-heel" },
    { id: "juguetes", label: "Juguetes", icon: "toy-brick" },
  ]

  // Lista de servicios para modelos
  const availableServices = [
    { id: "videollamada", label: "Videollamada", icon: "video" },
    { id: "chat", label: "Chat privado", icon: "chat" },
    { id: "fotos", label: "Fotos personalizadas", icon: "camera" },
    { id: "encuentros", label: "Encuentros", icon: "map-marker" },
    { id: "shows", label: "Shows en vivo", icon: "broadcast" },
    { id: "acompañante", label: "Acompañante", icon: "human-female-dance" },
    { id: "masajes", label: "Masajes", icon: "hand-heart" },
    { id: "dominatrix", label: "Dominatrix", icon: "crown" },
  ]

  // Estado para las preferencias seleccionadas
  const [selectedPreferences, setSelectedPreferences] = useState([])

  // Estado para los servicios seleccionados (solo para modelos)
  const [selectedServices, setSelectedServices] = useState([])

  // Estado para el tipo de modal que se muestra
  const [modalType, setModalType] = useState("preferences") // "preferences" o "services"

  // Función para manejar la selección de preferencias
  const togglePreference = (preference) => {
    if (selectedPreferences.includes(preference.id)) {
      setSelectedPreferences(selectedPreferences.filter((id) => id !== preference.id))
    } else {
      setSelectedPreferences([...selectedPreferences, preference.id])
    }
  }

  // Función para manejar la selección de servicios
  const toggleService = (service) => {
    if (selectedServices.includes(service.id)) {
      setSelectedServices(selectedServices.filter((id) => id !== service.id))
    } else {
      setSelectedServices([...selectedServices, service.id])
    }
  }

  // Obtener texto para mostrar las preferencias seleccionadas
  const getSelectedPreferencesText = () => {
    if (selectedPreferences.length === 0) {
      return "Selecciona tus intereses"
    }

    const selectedLabels = availablePreferences
      .filter((pref) => selectedPreferences.includes(pref.id))
      .map((pref) => pref.label)

    if (selectedLabels.length <= 2) {
      return selectedLabels.join(", ")
    }

    return `${selectedPreferences.length} intereses seleccionados`
  }

  // Obtener texto para mostrar los servicios seleccionados
  const getSelectedServicesText = () => {
    if (selectedServices.length === 0) {
      return "Selecciona los servicios que ofreces"
    }

    const selectedLabels = availableServices
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => service.label)

    if (selectedLabels.length <= 2) {
      return selectedLabels.join(", ")
    }

    return `${selectedServices.length} servicios seleccionados`
  }

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  // Función para alternar la visibilidad de la confirmación de contraseña
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  // Función para abrir el modal de preferencias
  const openPreferencesModal = () => {
    setModalType("preferences")
    setModalVisible(true)
  }

  // Función para abrir el modal de servicios
  const openServicesModal = () => {
    setModalType("services")
    setModalVisible(true)
  }

  // Función para manejar el registro
  const handleRegister = () => {
    // Limpiar error previo
    setErrorMessage("")

    // Validación básica
    if (!username || !email || !password || !confirmPassword || !address) {
      setErrorMessage("Todos los campos son obligatorios")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }

    // Validaciones específicas según el tipo de registro
    if (registerType === "consumer") {
      // Verificar que al menos una preferencia esté seleccionada
      if (selectedPreferences.length === 0) {
        setErrorMessage("Selecciona al menos una preferencia")
        return
      }
    } else {
      // Verificar que al menos un servicio esté seleccionado
      if (selectedServices.length === 0) {
        setErrorMessage("Selecciona al menos un servicio que ofreces")
        return
      }

      // Verificar que haya un número de teléfono
      if (!phone) {
        setErrorMessage("El número de teléfono es obligatorio para modelos")
        return
      }
    }

    // Iniciar proceso de registro
    setIsLoading(true)

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        // Aquí podrías guardar las preferencias en Firestore o en otro lugar
        // Por ejemplo: firestore().collection('users').doc(user.uid).set({
        //   preferences: selectedPreferences,
        //   userType: registerType,
        //   services: selectedServices,
        //   phone: phone,
        //   description: description,
        //   address: address
        // })

        // Guardar el tipo de usuario en el contexto y AsyncStorage
        saveUserType(registerType)

        updateProfile(user, {
          displayName: username,
        })
          .then(() => {
            console.log("Usuario creado con éxito:", user)
            console.log("Tipo de usuario:", registerType)
            console.log("Preferencias seleccionadas:", selectedPreferences)
            if (registerType === "model") {
              console.log("Servicios seleccionados:", selectedServices)
            }
            setIsLoading(false)
            navigation.navigate("Login")
          })
          .catch((error) => {
            setIsLoading(false)
            setErrorMessage(error.message)
          })
      })
      .catch((error) => {
        setIsLoading(false)

        // Mensajes de error más amigables
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("Este correo electrónico ya está en uso")
        } else if (error.code === "auth/invalid-email") {
          setErrorMessage("El formato del correo electrónico no es válido")
        } else if (error.code === "auth/weak-password") {
          setErrorMessage("La contraseña es demasiado débil")
        } else {
          setErrorMessage("Error al crear la cuenta: " + error.message)
        }
      })
  }

  // Estilos específicos para web
  const webStyles = isWeb
    ? {
        mainContainer: {
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
        scrollViewWeb: {
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        },
        scrollContentWeb: {
          minHeight: "100%",
          paddingBottom: 80,
        },
      }
    : {}

  return (
    <View style={[styles.container, isWeb && webStyles.mainContainer]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradientePrimario} style={styles.gradientBackground}>
        {isWeb ? (
          // Versión específica para web
          <div style={webStyles.scrollViewWeb}>
            <div style={webStyles.scrollContentWeb}>
              <View style={styles.content}>
                {/* Encabezado */}
                <View style={styles.headerContainer}>
                  <Image source={require("../../assets/imagenlogo.jpg")} style={styles.logo} />
                  <Text style={styles.title}>Crea una cuenta</Text>
                  <Text style={styles.subtitle}>¡Únete a nuestra comunidad y comienza a disfrutar!</Text>
                </View>

                {/* Contenido del formulario */}
                {renderFormContent()}
              </View>
            </div>
          </div>
        ) : (
          // Versión para móvil nativo
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.content}>
              {/* Encabezado */}
              <View style={styles.headerContainer}>
                <Image source={require("../../assets/imagenlogo.jpg")} style={styles.logo} />
                <Text style={styles.title}>Crea una cuenta</Text>
                <Text style={styles.subtitle}>¡Únete a nuestra comunidad y comienza a disfrutar!</Text>
              </View>

              {/* Contenido del formulario */}
              {renderFormContent()}
            </View>
          </ScrollView>
        )}
      </LinearGradient>

      {/* Modal para seleccionar preferencias o servicios */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#2A2A40", "#1A1A2E"]} // Colores más oscuros para mejor contraste
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modalType === "preferences" ? "Selecciona tus intereses" : "Selecciona tus servicios"}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                {modalType === "preferences"
                  ? "Elige las opciones que mejor se adapten a lo que buscas"
                  : "Selecciona los servicios que ofreces a tus clientes"}
              </Text>

              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.preferencesGrid}>
                  {modalType === "preferences"
                    ? // Mostrar preferencias
                      availablePreferences.map((preference) => {
                        const isSelected = selectedPreferences.includes(preference.id)
                        return (
                          <TouchableOpacity
                            key={preference.id}
                            style={[styles.preferenceCard, isSelected && styles.preferenceCardSelected]}
                            onPress={() => togglePreference(preference)}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.preferenceIconContainer,
                                isSelected && styles.preferenceIconContainerSelected,
                              ]}
                            >
                              <Icon
                                name={preference.icon}
                                size={28}
                                color={isSelected ? "#fff" : "#E0E0FF"} // Color más claro para mejor visibilidad
                              />
                            </View>
                            <Text style={[styles.preferenceText, isSelected && styles.preferenceTextSelected]}>
                              {preference.label}
                            </Text>
                            <View style={styles.checkIcon}>
                              <Icon
                                name={isSelected ? "check-circle" : "circle-outline"}
                                size={20}
                                color={isSelected ? "#5CFF5C" : "#E0E0FF"} // Verde brillante para seleccionados
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    : // Mostrar servicios
                      availableServices.map((service) => {
                        const isSelected = selectedServices.includes(service.id)
                        return (
                          <TouchableOpacity
                            key={service.id}
                            style={[styles.preferenceCard, isSelected && styles.serviceCardSelected]}
                            onPress={() => toggleService(service)}
                            activeOpacity={0.7}
                          >
                            <View
                              style={[
                                styles.preferenceIconContainer,
                                isSelected && styles.serviceIconContainerSelected,
                              ]}
                            >
                              <Icon
                                name={service.icon}
                                size={28}
                                color={isSelected ? "#fff" : "#E0E0FF"} // Color más claro para mejor visibilidad
                              />
                            </View>
                            <Text style={[styles.preferenceText, isSelected && styles.preferenceTextSelected]}>
                              {service.label}
                            </Text>
                            <View style={styles.checkIcon}>
                              <Icon
                                name={isSelected ? "check-circle" : "circle-outline"}
                                size={20}
                                color={isSelected ? "#5CFF5C" : "#E0E0FF"} // Verde brillante para seleccionados
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <Text style={styles.selectedCount}>
                  {modalType === "preferences" ? (
                    <>
                      {selectedPreferences.length}{" "}
                      {selectedPreferences.length === 1 ? "interés seleccionado" : "intereses seleccionados"}
                    </>
                  ) : (
                    <>
                      {selectedServices.length}{" "}
                      {selectedServices.length === 1 ? "servicio seleccionado" : "servicios seleccionados"}
                    </>
                  )}
                </Text>

                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <LinearGradient
                    colors={[colors.principal, colors.variante7]}
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.modalButtonText}>Confirmar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  )

  // Función para renderizar el contenido del formulario
  function renderFormContent() {
    return (
      <>
        {/* Selector de tipo de registro */}
        <View style={styles.registerTypeContainer}>
          <TouchableOpacity
            style={[styles.registerTypeButton, registerType === "consumer" && styles.registerTypeButtonActive]}
            onPress={() => setRegisterType("consumer")}
          >
            <Icon
              name="account-heart"
              size={24}
              color={registerType === "consumer" ? "#fff" : "rgba(255, 255, 255, 0.6)"}
            />
            <Text style={[styles.registerTypeText, registerType === "consumer" && styles.registerTypeTextActive]}>
              Usuario
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.registerTypeButton, registerType === "model" && styles.registerTypeButtonActive]}
            onPress={() => setRegisterType("model")}
          >
            <Icon name="crown" size={24} color={registerType === "model" ? "#fff" : "rgba(255, 255, 255, 0.6)"} />
            <Text style={[styles.registerTypeText, registerType === "model" && styles.registerTypeTextActive]}>
              Modelo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          {/* Input de nombre de usuario */}
          <View style={styles.inputContainer}>
            <Icon name="account-outline" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={username}
              onChangeText={setUsername}
            />
          </View>

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

          {/* Input de confirmación de contraseña */}
          <View style={styles.inputContainer}>
            <Icon name="lock-check-outline" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeButton}>
              <Icon name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Input de dirección */}
          <View style={styles.inputContainer}>
            <Icon name="home-outline" size={24} color="#fff" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Campos adicionales para modelos */}
          {registerType === "model" && (
            <>
              {/* Input de teléfono */}
              <View style={styles.inputContainer}>
                <Icon name="phone-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de teléfono"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Input de descripción */}
              <View style={styles.inputContainer}>
                <Icon name="text-box-outline" size={24} color="#fff" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Descripción breve"
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Sección de servicios */}
              <Text style={styles.preferencesTitle}>Servicios que ofreces</Text>

              <TouchableOpacity style={styles.dropdownButton} onPress={openServicesModal} activeOpacity={0.8}>
                <View style={styles.dropdownTextContainer}>
                  <Icon
                    name="briefcase-outline"
                    size={24}
                    color={selectedServices.length > 0 ? "#fff" : "rgba(255, 255, 255, 0.7)"}
                    style={styles.dropdownIcon}
                  />
                  <Text style={[styles.dropdownButtonText, selectedServices.length > 0 && styles.activeDropdownText]}>
                    {getSelectedServicesText()}
                  </Text>
                </View>
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}

          {/* Sección de preferencias (solo para consumidores) */}
          {registerType === "consumer" && (
            <>
              <Text style={styles.preferencesTitle}>Preferencias e Intereses</Text>

              <TouchableOpacity style={styles.dropdownButton} onPress={openPreferencesModal} activeOpacity={0.8}>
                <View style={styles.dropdownTextContainer}>
                  <Icon
                    name="heart-multiple"
                    size={24}
                    color={selectedPreferences.length > 0 ? "#fff" : "rgba(255, 255, 255, 0.7)"}
                    style={styles.dropdownIcon}
                  />
                  <Text
                    style={[styles.dropdownButtonText, selectedPreferences.length > 0 && styles.activeDropdownText]}
                  >
                    {getSelectedPreferencesText()}
                  </Text>
                </View>
                <Icon name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}

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
                    errorMessage.includes("campos")
                      ? "form-textbox-required"
                      : errorMessage.includes("contraseña")
                        ? "lock-alert"
                        : errorMessage.includes("correo")
                          ? "email-alert"
                          : errorMessage.includes("preferencia") || errorMessage.includes("servicio")
                            ? "heart-off"
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

          {/* Botón de registro */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.exito, "#1A9E4B"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>
                    {registerType === "consumer" ? "Registrarse como Usuario" : "Registrarse como Modelo"}
                  </Text>
                  <Icon name="arrow-right" size={20} color="#fff" style={styles.registerIcon} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Enlace a inicio de sesión */}
          <View style={styles.loginSectionContainer}>
            <LinearGradient
              colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.4)"]}
              style={styles.loginGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.loginContent}>
                <View style={styles.loginTextContainer}>
                  <Text style={styles.loginQuestion}>¿Ya tienes una cuenta?</Text>
                  <Text style={styles.loginSubtext}>Inicia sesión para continuar donde lo dejaste</Text>
                </View>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.variante7, colors.principal]}
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                    <Icon name="login" size={18} color="#fff" style={styles.loginIcon} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Espacio adicional al final para asegurar que todo sea accesible */}
          <View style={{ height: 50 }} />
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 50,
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 50,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
    marginBottom: 15,
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
    textAlign: "center",
  },
  // Estilos para el selector de tipo de registro
  registerTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 15,
    padding: 5,
  },
  registerTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  registerTypeButtonActive: {
    backgroundColor: colors.principal,
  },
  registerTypeText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  registerTypeTextActive: {
    color: "#fff",
    fontWeight: "bold",
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
  preferencesTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  dropdownTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  activeDropdownText: {
    color: "#fff",
  },
  // Estilos para el mensaje de error
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
  registerButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 30,
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
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  registerIcon: {
    marginLeft: 5,
  },
  // Estilos para la sección de login mejorada
  loginSectionContainer: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  loginButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loginIcon: {
    marginLeft: 5,
  },
  // Estilos para el modal de preferencias
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: "#1E1E2E", // Añadir un color de fondo oscuro para el modal
  },
  modalGradient: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)", // Aumentar opacidad del borde
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Aumentar opacidad para mejor visibilidad
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)", // Aumentar opacidad para mejor legibilidad
    marginBottom: 20,
  },
  modalScrollView: {
    flex: 1,
  },
  preferencesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  preferenceCard: {
    width: width * 0.38,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Aumentar opacidad para mejor contraste
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Aumentar opacidad del borde
  },
  preferenceCardSelected: {
    backgroundColor: "rgba(255, 120, 180, 0.4)", // Color más distintivo para selección
    borderColor: colors.principal,
    borderWidth: 2, // Borde más grueso para elementos seleccionados
  },
  serviceCardSelected: {
    backgroundColor: "rgba(120, 180, 255, 0.4)", // Color diferente para servicios seleccionados
    borderColor: colors.variante7,
    borderWidth: 2,
  },
  preferenceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Aumentar opacidad para mejor contraste
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  preferenceIconContainerSelected: {
    backgroundColor: colors.principal, // Usar color principal para elementos seleccionados
  },
  serviceIconContainerSelected: {
    backgroundColor: colors.variante7, // Color diferente para servicios seleccionados
  },
  preferenceText: {
    fontSize: 15, // Aumentar tamaño de fuente
    fontWeight: "500", // Texto más grueso para mejor legibilidad
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  preferenceTextSelected: {
    fontWeight: "bold",
    fontSize: 16, // Texto aún más grande cuando está seleccionado
  },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Añadir fondo al icono para mejor visibilidad
    borderRadius: 10,
    padding: 2,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 15,
    marginTop: 10,
  },
  selectedCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
  },
  modalButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default RegisterScreen
