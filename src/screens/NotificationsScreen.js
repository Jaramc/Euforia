"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Switch,
  Modal,
  ScrollView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

// Datos de ejemplo para las notificaciones
const NOTIFICATIONS_DATA = [
  {
    id: "notif1",
    type: "live",
    title: "Sofía Valentina está en vivo",
    message: "¡No te pierdas su show en vivo ahora!",
    time: "Hace 5 minutos",
    image: require("../../assets/Imagen (1).jpg"),
    modelId: "1",
    read: false,
  },
  {
    id: "notif2",
    type: "message",
    title: "Nuevo mensaje de Camila Rodríguez",
    message: "Hola, ¿cómo estás? Te envié algunas fotos nuevas...",
    time: "Hace 30 minutos",
    image: require("../../assets/Imagen (2).jpg"),
    modelId: "2",
    read: false,
  },
  {
    id: "notif3",
    type: "promo",
    title: "¡Oferta especial!",
    message: "Compra 1000 tokens y obtén 200 gratis. Oferta por tiempo limitado.",
    time: "Hace 2 horas",
    image: null,
    read: true,
  },
  {
    id: "notif4",
    type: "reminder",
    title: "Recordatorio: Show de Valentina Gómez",
    message: "El show VIP comenzará en 1 hora. ¡No te lo pierdas!",
    time: "Hace 3 horas",
    image: require("../../assets/Imagen (3).jpg"),
    modelId: "3",
    read: true,
  },
  {
    id: "notif5",
    type: "like",
    title: "A Sofía Valentina le gustó tu mensaje",
    message: "Tu mensaje recibió un me gusta de Sofía Valentina",
    time: "Hace 5 horas",
    image: require("../../assets/Imagen (1).jpg"),
    modelId: "1",
    read: true,
  },
  {
    id: "notif6",
    type: "system",
    title: "Actualización de la aplicación",
    message: "Hemos lanzado una nueva versión con mejoras y nuevas funciones.",
    time: "Hace 1 día",
    image: null,
    read: true,
  },
  {
    id: "notif7",
    type: "tokens",
    title: "Tokens añadidos",
    message: "Se han añadido 500 tokens a tu cuenta. ¡Disfrútalos!",
    time: "Hace 2 días",
    image: null,
    read: true,
  },
]

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    liveStreams: true,
    messages: true,
    promotions: true,
    reminders: true,
    likes: true,
    system: true,
  })

  // Marcar notificación como leída
  const markAsRead = (notificationId) => {
    setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  // Eliminar notificación
  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter((notif) => notif.id !== notificationId))
  }

  // Manejar tap en notificación
  const handleNotificationPress = (notification) => {
    markAsRead(notification.id)

    // Navegar según el tipo de notificación
    switch (notification.type) {
      case "live":
        navigation.navigate("StreamingScreen", { modelId: notification.modelId })
        break
      case "message":
        navigation.navigate("PrivateChat", { modelId: notification.modelId })
        break
      case "promo":
      case "tokens":
        navigation.navigate("BuyTokens")
        break
      case "reminder":
        navigation.navigate("ModelProfile", { modelId: notification.modelId })
        break
      case "like":
        navigation.navigate("PrivateChat", { modelId: notification.modelId })
        break
      default:
        // No hacer nada para notificaciones del sistema
        break
    }
  }

  // Renderizar una notificación
  const renderNotification = ({ item }) => {
    // Icono según el tipo de notificación
    const getNotificationIcon = () => {
      switch (item.type) {
        case "live":
          return <Icon name="broadcast" size={24} color="#FF4D4D" />
        case "message":
          return <Icon name="message-text" size={24} color={colors.principal} />
        case "promo":
          return <Icon name="tag" size={24} color="#FFD700" />
        case "reminder":
          return <Icon name="bell-ring" size={24} color="#FF9D4D" />
        case "like":
          return <Icon name="heart" size={24} color="#FF4D4D" />
        case "system":
          return <Icon name="information" size={24} color="#4D9EFF" />
        case "tokens":
          return <Icon name="coin" size={24} color="#FFD700" />
        default:
          return <Icon name="bell" size={24} color={colors.principal} />
      }
    }

    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationIconContainer}>{getNotificationIcon()}</View>

        {item.image ? (
          <Image source={item.image} style={styles.notificationImage} />
        ) : (
          <View style={styles.notificationPlaceholder}>
            <Icon name="bell" size={24} color="rgba(255, 255, 255, 0.5)" />
          </View>
        )}

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNotification(item.id)}>
          <Icon name="close" size={18} color={colors.variante3} />
        </TouchableOpacity>

        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    )
  }

  // Renderizar el encabezado de la lista
  const renderHeader = () => {
    const unreadCount = notifications.filter((notif) => !notif.read).length

    return (
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllButtonText}>Marcar todas como leídas</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  // Renderizar mensaje cuando no hay notificaciones
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bell-off" size={60} color={colors.variante3} />
      <Text style={styles.emptyTitle}>No tienes notificaciones</Text>
      <Text style={styles.emptyMessage}>
        Las notificaciones sobre transmisiones en vivo, mensajes y más aparecerán aquí.
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={[colors.variante1, colors.variante2]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettingsModal(true)}>
            <Icon name="cog" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Lista de notificaciones */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationsList}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Modal de configuración de notificaciones */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettingsModal}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configuración de notificaciones</Text>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="broadcast" size={24} color="#FF4D4D" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Transmisiones en vivo</Text>
                    <Text style={styles.settingDescription}>
                      Recibe notificaciones cuando tus modelos favoritos inicien una transmisión en vivo.
                    </Text>
                  </View>
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
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Mensajes</Text>
                    <Text style={styles.settingDescription}>
                      Recibe notificaciones cuando recibas nuevos mensajes de modelos.
                    </Text>
                  </View>
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
                  <Icon name="tag" size={24} color="#FFD700" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Promociones</Text>
                    <Text style={styles.settingDescription}>
                      Recibe notificaciones sobre ofertas especiales y promociones.
                    </Text>
                  </View>
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
                  <Icon name="bell-ring" size={24} color="#FF9D4D" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Recordatorios</Text>
                    <Text style={styles.settingDescription}>
                      Recibe recordatorios para shows programados y eventos.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationSettings.reminders}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, reminders: value })}
                  trackColor={{ false: "#767577", true: colors.principal }}
                  thumbColor="#f4f3f4"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="heart" size={24} color="#FF4D4D" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Me gusta</Text>
                    <Text style={styles.settingDescription}>
                      Recibe notificaciones cuando a un modelo le guste tu mensaje.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationSettings.likes}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, likes: value })}
                  trackColor={{ false: "#767577", true: colors.principal }}
                  thumbColor="#f4f3f4"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="information" size={24} color="#4D9EFF" />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Sistema</Text>
                    <Text style={styles.settingDescription}>
                      Recibe notificaciones sobre actualizaciones y cambios en la plataforma.
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationSettings.system}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, system: value })}
                  trackColor={{ false: "#767577", true: colors.principal }}
                  thumbColor="#f4f3f4"
                />
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={() => setShowSettingsModal(false)}>
              <LinearGradient colors={[colors.principal, colors.variante7]} style={styles.saveButtonGradient}>
                <Text style={styles.saveButtonText}>Guardar configuración</Text>
              </LinearGradient>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationsList: {
    paddingBottom: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  listTitle: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
  },
  markAllButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  markAllButtonText: {
    color: colors.principal,
    fontSize: 12,
    fontWeight: "500",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    padding: 15,
    position: "relative",
  },
  unreadNotification: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  notificationIconContainer: {
    position: "absolute",
    top: -10,
    left: -10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.fondoOscuro,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notificationPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: colors.luminous,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationMessage: {
    color: colors.variante3,
    fontSize: 12,
    marginBottom: 5,
  },
  notificationTime: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  unreadIndicator: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.principal,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginTop: 50,
  },
  emptyTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyMessage: {
    color: colors.variante3,
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsList: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  settingDescription: {
    color: colors.variante3,
    fontSize: 12,
    lineHeight: 16,
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default NotificationsScreen
