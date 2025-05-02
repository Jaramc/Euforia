"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  RefreshControl,
  Switch,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width } = Dimensions.get("window")

const ModelHomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const scrollY = new Animated.Value(0)

  // Datos de ejemplo para estadísticas
  const stats = {
    views: 1245,
    likes: 328,
    messages: 87,
    earnings: "$1,250",
    rating: 4.8,
    completedServices: 42,
  }

  // Datos de ejemplo para solicitudes pendientes
  const pendingRequests = [
    {
      id: "req1",
      clientName: "Carlos Mendoza",
      service: "Videollamada",
      time: "Hoy, 18:30",
      price: "$80",
      status: "pending",
    },
    {
      id: "req2",
      clientName: "Roberto Sánchez",
      service: "Chat privado",
      time: "Mañana, 20:00",
      price: "$50",
      status: "pending",
    },
    {
      id: "req3",
      clientName: "Miguel Ángel",
      service: "Fotos personalizadas",
      time: "Viernes, 19:00",
      price: "$120",
      status: "confirmed",
    },
  ]

  // Datos de ejemplo para mensajes recientes (sin fotos para los usuarios)
  const recentMessages = [
    {
      id: "msg1",
      name: "Carlos Mendoza",
      message: "Hola, ¿estás disponible para una sesión hoy?",
      time: "12:30",
      unread: 2,
    },
    {
      id: "msg2",
      name: "Roberto Sánchez",
      message: "Me gustaría reservar una videollamada contigo",
      time: "10:45",
      unread: 0,
    },
    {
      id: "msg3",
      name: "Miguel Ángel",
      message: "¿Podrías enviarme más detalles sobre tus servicios?",
      time: "Ayer",
      unread: 1,
    },
  ]

  // Función para simular una actualización
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  // Renderizar una solicitud
  const renderRequestItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.requestCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("RequestDetails", { request: item })}
      >
        <View style={styles.requestHeader}>
          <View style={styles.clientInfo}>
            <View style={styles.clientAvatarPlaceholder}>
              <Icon name="account" size={24} color="rgba(255, 255, 255, 0.7)" />
            </View>
            <View>
              <Text style={styles.clientName}>{item.clientName}</Text>
              <Text style={styles.serviceType}>{item.service}</Text>
            </View>
          </View>
          <View style={styles.requestPrice}>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        </View>

        <View style={styles.requestDetails}>
          <View style={styles.timeContainer}>
            <Icon name="clock-outline" size={16} color={colors.variante3} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          <View style={styles.requestActions}>
            {item.status === "pending" ? (
              <>
                <TouchableOpacity style={styles.acceptButton}>
                  <Icon name="check" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <Icon name="close" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Rechazar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.confirmedStatus}>
                <Icon name="check-circle" size={16} color={colors.exito} />
                <Text style={styles.confirmedText}>Confirmado</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizar un mensaje reciente
  const renderMessageItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.messageItem}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ChatDetail", { chat: item })}
      >
        <View style={styles.messageAvatarContainer}>
          <View style={styles.messageAvatarPlaceholder}>
            <Icon name="account" size={24} color="rgba(255, 255, 255, 0.7)" />
          </View>
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.messageName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.messageText} numberOfLines={1}>
            {item.message}
          </Text>
        </View>
        <View style={styles.messageMeta}>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.messageUnreadBadge}>
              <Text style={styles.messageUnreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  // Calcular la opacidad del header basado en el scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header con efecto de desvanecimiento */}
      <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]}>
        <LinearGradient colors={[colors.variante1, "transparent"]} style={styles.headerGradient} />
      </Animated.View>

      {/* Header Content */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Panel de modelo</Text>
            <Text style={styles.userName}>{user?.displayName || "Sofía Valentina"}</Text>
          </View>

          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("Perfil")}>
            <Image source={require("../../assets/Imagen (1).jpg")} style={styles.avatarImage} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.principal}
            colors={[colors.principal, colors.variante7]}
          />
        }
      >
        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Perfil de la modelo con foto */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <Image source={require("../../assets/Imagen (1).jpg")} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.displayName || "Sofía Valentina"}</Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{stats.rating}</Text>
                  <Text style={styles.reviewsText}>({stats.completedServices} servicios)</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Estado en línea */}
          <View style={styles.onlineStatusContainer}>
            <View style={styles.onlineStatusContent}>
              <View style={styles.onlineStatusTextContainer}>
                <Text style={styles.onlineStatusTitle}>Estado</Text>
                <Text style={styles.onlineStatusSubtitle}>
                  {isOnline ? "Disponible para servicios" : "No disponible"}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: "#767577", true: colors.principal }}
                thumbColor={isOnline ? colors.exito : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                style={styles.switch}
              />
            </View>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Icon name="eye" size={24} color={colors.principal} />
                <Text style={styles.statValue}>{stats.views}</Text>
                <Text style={styles.statLabel}>Visitas</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="heart" size={24} color={colors.error} />
                <Text style={styles.statValue}>{stats.likes}</Text>
                <Text style={styles.statLabel}>Me gusta</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="message-text" size={24} color={colors.variante7} />
                <Text style={styles.statValue}>{stats.messages}</Text>
                <Text style={styles.statLabel}>Mensajes</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="cash" size={24} color={colors.exito} />
                <Text style={styles.statValue}>{stats.earnings}</Text>
                <Text style={styles.statLabel}>Ganancias</Text>
              </View>
            </View>
          </View>

          {/* Solicitudes pendientes */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
              <TouchableOpacity onPress={() => navigation.navigate("AllRequests")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {pendingRequests.length > 0 ? (
              <FlatList
                data={pendingRequests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id}
                horizontal={false}
                scrollEnabled={false}
                contentContainerStyle={styles.requestsList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="calendar-check" size={50} color={colors.variante3} />
                <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
                <Text style={styles.emptySubtext}>Las nuevas solicitudes aparecerán aquí</Text>
              </View>
            )}
          </View>

          {/* Mensajes recientes */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mensajes recientes</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Mensajes")}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {recentMessages.length > 0 ? (
              <FlatList
                data={recentMessages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id}
                horizontal={false}
                scrollEnabled={false}
                contentContainerStyle={styles.messagesList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="message-text-outline" size={50} color={colors.variante3} />
                <Text style={styles.emptyText}>No hay mensajes recientes</Text>
                <Text style={styles.emptySubtext}>Los nuevos mensajes aparecerán aquí</Text>
              </View>
            )}
          </View>
        </View>

        {/* Espacio al final para evitar que el contenido quede oculto */}
        <View style={styles.bottomSpace} />
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondoOscuro,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  headerGradient: {
    height: "100%",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: colors.variante3,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.luminous,
  },
  profileButton: {
    position: "relative",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Estilos para la sección de perfil
  profileSection: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.principal,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.luminous,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewsText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 5,
    fontSize: 12,
  },
  // Estilos para el estado en línea
  onlineStatusContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },
  onlineStatusContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  onlineStatusTextContainer: {
    flex: 1,
  },
  onlineStatusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.luminous,
    marginBottom: 5,
  },
  onlineStatusSubtitle: {
    fontSize: 14,
    color: colors.variante3,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  // Estilos para las estadísticas
  statsContainer: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.luminous,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.variante3,
  },
  // Estilos para secciones
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.luminous,
  },
  seeAllText: {
    color: colors.principal,
    fontSize: 14,
  },
  // Estilos para solicitudes
  requestsList: {
    marginBottom: 10,
  },
  requestCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.luminous,
  },
  serviceType: {
    fontSize: 14,
    color: colors.variante3,
  },
  requestPrice: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  priceText: {
    color: colors.luminous,
    fontWeight: "bold",
    fontSize: 16,
  },
  requestDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: colors.variante3,
    marginLeft: 5,
    fontSize: 14,
  },
  requestActions: {
    flexDirection: "row",
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.exito,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  confirmedStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 180, 0, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confirmedText: {
    color: colors.exito,
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  // Estilos para mensajes
  messagesList: {
    marginBottom: 10,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  messageAvatarContainer: {
    marginRight: 12,
  },
  messageAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  messageInfo: {
    flex: 1,
    justifyContent: "center",
  },
  messageName: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  messageText: {
    color: colors.variante3,
    fontSize: 14,
  },
  messageMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  messageTime: {
    color: colors.variante3,
    fontSize: 12,
    marginBottom: 5,
  },
  messageUnreadBadge: {
    backgroundColor: colors.principal,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  messageUnreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Estilos para contenido vacío
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  emptyText: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  emptySubtext: {
    color: colors.variante3,
    fontSize: 14,
    marginTop: 5,
  },
  bottomSpace: {
    height: 80,
  },
})

export default ModelHomeScreen
