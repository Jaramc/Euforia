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
  Alert,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import * as ImagePicker from "expo-image-picker"

import { auth } from "../services/firebaseConfig"
import colors from "../constants/colors" // Assuming colors.js has principal, variante7, etc.
import { useAuth } from "../context/AuthContext"

const { width } = Dimensions.get("window")

// Helper function to convert URI to Blob
async function uriToBlob(uri) {
  const response = await fetch(uri)
  const blobData = await response.blob()
  return blobData
}

const RegisterScreen = ({ navigation }) => {
  const { saveUserType } = useAuth()

  const [registerType, setRegisterType] = useState("consumer")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const isWeb = Platform.OS === "web"

  const [profileImageUri, setProfileImageUri] = useState(null)
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false)

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
  const [selectedPreferences, setSelectedPreferences] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [modalType, setModalType] = useState("preferences")

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la galería.")
      return false
    }
    return true
  }

  const pickProfileImage = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImageUri(result.assets[0].uri)
    }
  }

  const uploadProfileImage = async (userId, imageUri) => {
    if (!imageUri) return null
    setIsUploadingProfilePic(true)
    try {
      const blob = await uriToBlob(imageUri)
      const storage = getStorage()
      const storageRef = ref(storage, `profile_pictures/${userId}/initial_profile_${Date.now()}`)

      await uploadBytes(storageRef, blob)
      const downloadURL = await getDownloadURL(storageRef)
      setIsUploadingProfilePic(false)
      return downloadURL
    } catch (error) {
      console.error("Error uploading profile image: ", error)
      Alert.alert("Error", "No se pudo subir la imagen de perfil.")
      setIsUploadingProfilePic(false)
      return null
    }
  }

  const togglePreference = (preference) => {
    if (selectedPreferences.includes(preference.id)) {
      setSelectedPreferences(selectedPreferences.filter((id) => id !== preference.id))
    } else {
      setSelectedPreferences([...selectedPreferences, preference.id])
    }
  }

  const toggleService = (service) => {
    if (selectedServices.includes(service.id)) {
      setSelectedServices(selectedServices.filter((id) => id !== service.id))
    } else {
      setSelectedServices([...selectedServices, service.id])
    }
  }

  const getSelectedPreferencesText = () => {
    if (selectedPreferences.length === 0) {
      return "Selecciona tus intereses"
    }
    const selectedLabels = availablePreferences
      .filter((pref) => selectedPreferences.includes(pref.id))
      .map((pref) => pref.label)
    return selectedLabels.length <= 2
      ? selectedLabels.join(", ")
      : `${selectedPreferences.length} intereses seleccionados`
  }

  const getSelectedServicesText = () => {
    if (selectedServices.length === 0) {
      return "Selecciona los servicios que ofreces"
    }
    const selectedLabels = availableServices
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => service.label)
    return selectedLabels.length <= 2 ? selectedLabels.join(", ") : `${selectedServices.length} servicios seleccionados`
  }

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible)

  const openPreferencesModal = () => {
    setModalType("preferences")
    setModalVisible(true)
  }
  const openServicesModal = () => {
    setModalType("services")
    setModalVisible(true)
  }

  const handleRegister = async () => {
    setErrorMessage("")
    if (!username || !email || !password || !confirmPassword || !address) {
      setErrorMessage("Todos los campos son obligatorios")
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }
    if (registerType === "consumer" && selectedPreferences.length === 0) {
      setErrorMessage("Selecciona al menos una preferencia")
      return
    }
    if (registerType === "model") {
      if (selectedServices.length === 0) {
        setErrorMessage("Selecciona al menos un servicio que ofreces")
        return
      }
      if (!phone) {
        setErrorMessage("El número de teléfono es obligatorio para modelos")
        return
      }
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      let photoURL = null
      if (registerType === "model" && profileImageUri) {
        photoURL = await uploadProfileImage(user.uid, profileImageUri)
      }

      await updateProfile(user, {
        displayName: username,
        ...(photoURL && { photoURL: photoURL }),
      })

      await saveUserType(registerType)

      console.log("Usuario creado con éxito:", user)
      setIsLoading(false)
      navigation.navigate("Login")
    } catch (error) {
      setIsLoading(false)
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Este correo electrónico ya está en uso")
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("El formato del correo electrónico no es válido")
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("La contraseña es demasiado débil")
      } else {
        setErrorMessage("Error al crear la cuenta: " + error.message)
      }
    }
  }

  const webStyles = isWeb
    ? {
        mainContainer: { minHeight: "100vh", display: "flex", flexDirection: "column" },
        scrollViewWeb: { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" },
        scrollContentWeb: { minHeight: "100%", paddingBottom: 80 },
      }
    : {}

  function renderFormContent() {
    return (
      <>
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

        {registerType === "model" && (
          <View style={styles.profileImageSection}>
            <Text style={styles.preferencesTitle}>Foto de Perfil (Opcional)</Text>
            <TouchableOpacity style={styles.profileImagePicker} onPress={pickProfileImage}>
              {isUploadingProfilePic ? (
                <ActivityIndicator size="large" color={colors.principal} />
              ) : profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={styles.profileImagePreview} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Icon name="camera-plus-outline" size={40} color="rgba(255, 255, 255, 0.7)" />
                  <Text style={styles.profileImagePlaceholderText}>Subir foto</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.formContainer}>
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

          {registerType === "model" && (
            <>
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

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading || isUploadingProfilePic}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.exito, "#1A9E4B"]} // Assuming colors.exito is defined
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading || isUploadingProfilePic ? (
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

          {/* --- "Already have an account?" Section - Styled like LoginScreen's Register section --- */}
          <View style={styles.alreadyAccountSectionContainer}>
            <LinearGradient
              colors={["rgba(180, 60, 220, 0.8)", "rgba(150, 30, 180, 0.9)"]} // Colors from LoginScreen's register section
              style={styles.alreadyAccountGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.alreadyAccountContent}>
                <View style={styles.alreadyAccountTextContainer}>
                  <Text style={styles.alreadyAccountQuestion}>¿Ya tienes una cuenta?</Text>
                  <Text style={styles.alreadyAccountSubtext}>Inicia sesión para continuar</Text>
                </View>

                <TouchableOpacity
                  style={styles.alreadyAccountButton}
                  onPress={() => navigation.navigate("Login")}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.2)"]} // Colors from LoginScreen's register button
                    style={styles.alreadyAccountButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.alreadyAccountButtonText}>Iniciar Sesión</Text>
                    <Icon name="login-variant" size={18} color="#fff" style={styles.alreadyAccountIcon} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
          {/* --- End of "Already have an account?" Section --- */}

          <View style={{ height: 50 }} />
        </View>
      </>
    )
  }

  return (
    <View style={[styles.container, isWeb && webStyles.mainContainer]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={colors.gradientePrimario || ["#6a11cb", "#2575fc"]} style={styles.gradientBackground}>
        {isWeb ? (
          <div style={webStyles.scrollViewWeb}>
            <div style={webStyles.scrollContentWeb}>
              <View style={styles.content}>
                <View style={styles.headerContainer}>
                  <Image source={require("../../assets/imagenlogo.jpg")} style={styles.logo} />
                  <Text style={styles.title}>Crea una cuenta</Text>
                  <Text style={styles.subtitle}>¡Únete a nuestra comunidad y comienza a disfrutar!</Text>
                </View>
                {renderFormContent()}
              </View>
            </div>
          </div>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.content}>
              <View style={styles.headerContainer}>
                <Image source={require("../../assets/imagenlogo.jpg")} style={styles.logo} />
                <Text style={styles.title}>Crea una cuenta</Text>
                <Text style={styles.subtitle}>¡Únete a nuestra comunidad y comienza a disfrutar!</Text>
              </View>
              {renderFormContent()}
            </View>
          </ScrollView>
        )}
      </LinearGradient>

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
              colors={["#2A2A40", "#1A1A2E"]}
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
                    ? availablePreferences.map((preference) => {
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
                              <Icon name={preference.icon} size={28} color={isSelected ? "#fff" : "#E0E0FF"} />
                            </View>
                            <Text style={[styles.preferenceText, isSelected && styles.preferenceTextSelected]}>
                              {preference.label}
                            </Text>
                            <View style={styles.checkIcon}>
                              <Icon
                                name={isSelected ? "check-circle" : "circle-outline"}
                                size={20}
                                color={isSelected ? "#5CFF5C" : "#E0E0FF"}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    : availableServices.map((service) => {
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
                              <Icon name={service.icon} size={28} color={isSelected ? "#fff" : "#E0E0FF"} />
                            </View>
                            <Text style={[styles.preferenceText, isSelected && styles.preferenceTextSelected]}>
                              {service.label}
                            </Text>
                            <View style={styles.checkIcon}>
                              <Icon
                                name={isSelected ? "check-circle" : "circle-outline"}
                                size={20}
                                color={isSelected ? "#5CFF5C" : "#E0E0FF"}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <Text style={styles.selectedCount}>
                  {modalType === "preferences"
                    ? `${selectedPreferences.length} ${
                        selectedPreferences.length === 1 ? "interés seleccionado" : "intereses seleccionados"
                      }`
                    : `${selectedServices.length} ${
                        selectedServices.length === 1 ? "servicio seleccionado" : "servicios seleccionados"
                      }`}
                </Text>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <LinearGradient
                    colors={[colors.principal || "#FF69B4", colors.variante7 || "#C71585"]}
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
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientBackground: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 40, paddingTop: Platform.OS === "ios" ? 60 : 50 },
  content: { paddingHorizontal: 30, paddingBottom: 40, paddingTop: Platform.OS === "ios" ? 60 : 50 },
  headerContainer: { alignItems: "center", marginBottom: 30 },
  logo: { width: 100, height: 100, borderRadius: 50, resizeMode: "cover", marginBottom: 15 },
  title: { fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "rgba(255, 255, 255, 0.8)", textAlign: "center" },
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
  registerTypeButtonActive: { backgroundColor: colors.principal || "#FF69B4" },
  registerTypeText: { color: "rgba(255, 255, 255, 0.6)", marginLeft: 8, fontSize: 16, fontWeight: "500" },
  registerTypeTextActive: { color: "#fff", fontWeight: "bold" },
  profileImageSection: { marginBottom: 20, alignItems: "center" },
  profileImagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  profileImagePreview: { width: "100%", height: "100%" },
  profileImagePlaceholder: { justifyContent: "center", alignItems: "center" },
  profileImagePlaceholderText: { color: "rgba(255, 255, 255, 0.7)", marginTop: 5 },
  formContainer: { width: "100%" },
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
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#fff" },
  eyeButton: { padding: 10 },
  preferencesTitle: { fontSize: 18, color: "#fff", fontWeight: "600", marginTop: 10, marginBottom: 10 },
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
  dropdownTextContainer: { flexDirection: "row", alignItems: "center" },
  dropdownIcon: { marginRight: 10 },
  dropdownButtonText: { fontSize: 16, color: "rgba(255, 255, 255, 0.7)" },
  activeDropdownText: { color: "#fff" },
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
  errorGradient: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 15 },
  errorIcon: { marginRight: 10 },
  errorText: { color: "#fff", fontSize: 14, fontWeight: "500", flex: 1 },
  registerButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 30, // Increased margin to give space for the new section
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonGradient: { flexDirection: "row", paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  registerButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginRight: 5 },
  registerIcon: { marginLeft: 5 },

  // --- Styles for "Already have an account?" section, mimicking LoginScreen's register section ---
  alreadyAccountSectionContainer: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 10, // Consistent with LoginScreen's original style for this type of block
  },
  alreadyAccountGradient: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  alreadyAccountContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alreadyAccountTextContainer: {
    flex: 1,
  },
  alreadyAccountQuestion: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  alreadyAccountSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    marginTop: 2,
  },
  alreadyAccountButton: {
    // This is the small button inside the section
    borderRadius: 25,
    overflow: "hidden",
  },
  alreadyAccountButtonGradient: {
    // Gradient for the small button
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  alreadyAccountButtonText: {
    color: "#fff",
    fontSize: 14, // Matching LoginScreen's small button text
    fontWeight: "bold",
  },
  alreadyAccountIcon: {
    marginLeft: 5,
  },
  // --- End of "Already have an account?" section styles ---

  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.7)" },
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
    backgroundColor: "#1E1E2E",
  },
  modalGradient: { width: "100%", height: "100%", padding: 20 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
    paddingBottom: 15,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitle: { fontSize: 14, color: "rgba(255, 255, 255, 0.9)", marginBottom: 20 },
  modalScrollView: { flex: 1 },
  preferencesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  preferenceCard: {
    width: width * 0.38,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  preferenceCardSelected: {
    backgroundColor: "rgba(255, 120, 180, 0.4)",
    borderColor: colors.principal || "#FF69B4",
    borderWidth: 2,
  },
  serviceCardSelected: {
    backgroundColor: "rgba(120, 180, 255, 0.4)",
    borderColor: colors.variante7 || "#C71585",
    borderWidth: 2,
  },
  preferenceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  preferenceIconContainerSelected: { backgroundColor: colors.principal || "#FF69B4" },
  serviceIconContainerSelected: { backgroundColor: colors.variante7 || "#C71585" },
  preferenceText: { fontSize: 15, fontWeight: "500", color: "#fff", textAlign: "center", marginBottom: 5 },
  preferenceTextSelected: { fontWeight: "bold", fontSize: 16 },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    padding: 2,
  },
  modalFooter: { borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.2)", paddingTop: 15, marginTop: 10 },
  selectedCount: { fontSize: 14, color: "rgba(255, 255, 255, 0.8)", marginBottom: 15, textAlign: "center" },
  modalButton: { width: "100%", borderRadius: 30, overflow: "hidden" },
  modalButtonGradient: { paddingVertical: 15, alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
})

export default RegisterScreen
