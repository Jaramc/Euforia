"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  Modal,
  TextInput,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const SettingsScreen = ({ navigation }) => {
  const { user, signOut } = useAuth()
  const [notificationSettings, setNotificationSettings] = useState({
    liveStreams: true,
    messages: true,
    promotions: false,
    reminders: true,
    likes: true,
    system: true,
  })
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    allowDirectMessages: true,
    showActivity: true,
  })
  const [paymentSettings, setPaymentSettings] = useState({
    autoRenew: false,
    savePaymentInfo: true,
    receiveReceipts: true,
  })
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  // Cambiar contraseña
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden")
      return
    }

    // Aquí iría la lógica para cambiar la contraseña
    Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente")
    setShowChangePasswordModal(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  // Eliminar cuenta
  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "ELIMINAR") {
      Alert.alert("Error", "Por favor escribe ELIMINAR para confirmar")
      return
    }

    // Aquí iría la lógica para eliminar la cuenta
    Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada correctamente", [
      {
        text: "OK",
        onPress: () => {
          signOut()
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        },
      },
    ])
  }

  // Cerrar sesión
  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: () => {
          signOut()
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[colors.variante1, colors.variante2]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configuración</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Sección de cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("EditProfile")}>
            <View style={styles.settingInfo}>
              <Icon name="account-edit" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Editar perfil</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => setShowChangePasswordModal(true)}>
            <View style={styles.settingInfo}>
              <Icon name="lock" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Cambiar contraseña</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("PaymentMethods")}>
            <View style={styles.settingInfo}>
              <Icon name="credit-card" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Métodos de pago</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("TransactionHistory")}>
            <View style={styles.settingInfo}>
              <Icon name="history" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Historial de transacciones</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>
        </View>

        {/* Sección de notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="broadcast" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Transmisiones en vivo</Text>
            </View>
            <Switch
              value={notificationSettings.liveStreams}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, liveStreams: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="message-text" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Mensajes</Text>
            </View>
            <Switch
              value={notificationSettings.messages}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, messages: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="tag" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Promociones</Text>
            </View>
            <Switch
              value={notificationSettings.promotions}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, promotions: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="bell-ring" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Recordatorios</Text>
            </View>
            <Switch
              value={notificationSettings.reminders}
              onValueChange={(value) => setNotificationSettings({ ...notificationSettings, reminders: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        {/* Sección de privacidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="account-check" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Mostrar estado en línea</Text>
            </View>
            <Switch
              value={privacySettings.showOnlineStatus}
              onValueChange={(value) => setPrivacySettings({ ...privacySettings, showOnlineStatus: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="message-processing" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Permitir mensajes directos</Text>
            </View>
            <Switch
              value={privacySettings.allowDirectMessages}
              onValueChange={(value) => setPrivacySettings({ ...privacySettings, allowDirectMessages: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="eye" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Mostrar actividad</Text>
            </View>
            <Switch
              value={privacySettings.showActivity}
              onValueChange={(value) => setPrivacySettings({ ...privacySettings, showActivity: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        {/* Sección de pagos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pagos</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="refresh" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Renovación automática</Text>
            </View>
            <Switch
              value={paymentSettings.autoRenew}
              onValueChange={(value) => setPaymentSettings({ ...paymentSettings, autoRenew: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="credit-card-check" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Guardar información de pago</Text>
            </View>
            <Switch
              value={paymentSettings.savePaymentInfo}
              onValueChange={(value) => setPaymentSettings({ ...paymentSettings, savePaymentInfo: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="receipt" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Recibir recibos por email</Text>
            </View>
            <Switch
              value={paymentSettings.receiveReceipts}
              onValueChange={(value) => setPaymentSettings({ ...paymentSettings, receiveReceipts: value })}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>

        {/* Sección de soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("HelpCenter")}>
            <View style={styles.settingInfo}>
              <Icon name="help-circle" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Centro de ayuda</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("ContactSupport")}>
            <View style={styles.settingInfo}>
              <Icon name="headset" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Contactar soporte</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("PrivacyPolicy")}>
            <View style={styles.settingInfo}>
              <Icon name="shield-check" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Política de privacidad</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("TermsOfService")}>
            <View style={styles.settingInfo}>
              <Icon name="file-document" size={24} color={colors.principal} />
              <Text style={styles.settingText}>Términos de servicio</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.variante3} />
          </TouchableOpacity>
        </View>

        {/* Sección de cuenta */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.dangerButton} onPress={() => setShowDeleteAccountModal(true)}>
            <Icon name="delete" size={24} color={colors.error} />
            <Text style={styles.dangerButtonText}>Eliminar cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Icon name="logout" size={24} color="#fff" />
            <Text style={styles.signOutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal para cambiar contraseña */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePasswordModal}
        onRequestClose={() => setShowChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar contraseña</Text>
              <TouchableOpacity onPress={() => setShowChangePasswordModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña actual</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña actual"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nueva contraseña</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nueva contraseña"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar nueva contraseña</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
              <LinearGradient
                colors={[colors.principal, colors.variante7]}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonText}>Cambiar contraseña</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para eliminar cuenta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteAccountModal}
        onRequestClose={() => setShowDeleteAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Eliminar cuenta</Text>
              <TouchableOpacity onPress={() => setShowDeleteAccountModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <Text style={styles.deleteWarning}>
              Esta acción es irreversible. Todos tus datos, mensajes y compras serán eliminados permanentemente.
            </Text>

            <Text style={styles.deleteConfirmationText}>
              Escribe "ELIMINAR" para confirmar que deseas eliminar tu cuenta:
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.deleteConfirmationInput}
                placeholder="ELIMINAR"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={deleteConfirmation}
                onChangeText={setDeleteConfirmation}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.deleteAccountButton,
                deleteConfirmation !== "ELIMINAR" && styles.deleteAccountButtonDisabled,
              ]}
              onPress={handleDeleteAccount}
              disabled={deleteConfirmation !== "ELIMINAR"}
            >
              <LinearGradient
                colors={[colors.error, "#FF6B6B"]}
                style={styles.deleteAccountButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.deleteAccountButtonText}>Eliminar mi cuenta</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelDeleteButton} onPress={() => setShowDeleteAccountModal(false)}>
              <Text style={styles.cancelDeleteButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondoOscuro,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    color: colors.variante3,
    fontSize: 16,
    marginLeft: 15,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  dangerButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.principal,
    borderRadius: 12,
    padding: 15,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  versionInfo: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 15,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: colors.variante3,
    marginBottom: 10,
  },
  passwordInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  input: {
    color: "#fff",
    paddingVertical: 12,
  },
  modalButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 10,
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
  deleteWarning: {
    color: colors.error,
    marginBottom: 20,
    textAlign: "center",
  },
  deleteConfirmationText: {
    color: colors.variante3,
    marginBottom: 15,
  },
  deleteConfirmationInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteAccountButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
  },
  deleteAccountButtonDisabled: {
    opacity: 0.5,
  },
  deleteAccountButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  deleteAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelDeleteButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  cancelDeleteButtonText: {
    color: colors.variante3,
    fontSize: 16,
  },
})

export default SettingsScreen
