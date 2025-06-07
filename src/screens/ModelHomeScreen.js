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
  ScrollView,
  Modal,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width, height } = Dimensions.get("window")

const ModelHomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showStreamModal, setShowStreamModal] = useState(false)
  const scrollY = new Animated.Value(0)

  // Estados para el streaming
  const [streamType, setStreamType] = useState("public") // public, private, vip
  const [streamPrice, setStreamPrice] = useState("0")
  const [viewerCount, setViewerCount] = useState(0)

  // Datos mejorados de estadísticas
  const stats = {
    views: 12456,
    likes: 3287,
    messages: 87,
    earnings: "$12,850",
    todayEarnings: "$450",
    monthlyEarnings: "$12,850",
    rating: 4.8,
    completedServices: 142,
    activeSubscribers: 234,
    tokens: 45670,
    streamMinutes: 1250,
  }

  // Datos de shows programados
  const scheduledShows = [
    {
      id: "show1",
      title: "Show Especial de Viernes",
      date: "Hoy, 22:00",
      type: "public",
      expectedViewers: 150,
      price: "Gratis",
    },
    {
      id: "show2",
      title: "Show VIP Exclusivo",
      date: "Mañana, 21:00",
      type: "vip",
      expectedViewers: 50,
      price: "$30",
    },
  ]

  // Top fans/suscriptores
  const topFans = [
    {
      id: "fan1",
      name: "Carlos M.",
      tokens: 5000,
      level: "VIP",
      avatar: null,
    },
    {
      id: "fan2",
      name: "Roberto S.",
      tokens: 3500,
      level: "Premium",
      avatar: null,
    },
    {
      id: "fan3",
      name: "Miguel A.",
      tokens: 2000,
      level: "Regular",
      avatar: null,
    },
  ]

  // Solicitudes de shows privados mejoradas
  const privateRequests = [
    {
      id: "req1",
      clientName: "Carlos Mendoza",
      service: "Show Privado",
      duration: "30 min",
      time: "Hoy, 18:30",
      price: "$80",
      tokens: 800,
      status: "pending",
      userLevel: "VIP",
    },
    {
      id: "req2",
      clientName: "Roberto Sánchez",
      service: "Videollamada Exclusiva",
      duration: "15 min",
      time: "Mañana, 20:00",
      price: "$50",
      tokens: 500,
      status: "pending",
      userLevel: "Premium",
    },
  ]

  // Función para iniciar streaming
  const startStreaming = () => {
    setShowStreamModal(false)
    setIsStreaming(true)
    navigation.navigate("StreamingScreen", {
      streamType,
      streamPrice,
    })
  }

  // Función para simular una actualización
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  // Renderizar tarjeta de estadística mejorada
  const renderStatCard = (icon, value, label, color, trend = null) => {
    return (
      <TouchableOpacity style={styles.statCard} activeOpacity={0.8}>
        <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]} style={styles.statCardGradient}>
          <View style={styles.statIconContainer}>
            <Icon name={icon} size={24} color={color} />
          </View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
          {trend && (
            <View style={styles.trendContainer}>
              <Icon
                name={trend > 0 ? "trending-up" : "trending-down"}
                size={14}
                color={trend > 0 ? colors.exito : colors.error}
              />
              <Text style={[styles.trendText, { color: trend > 0 ? colors.exito : colors.error }]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar solicitud privada
  const renderPrivateRequest = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.requestCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("RequestDetails", { request: item })}
      >
        <LinearGradient colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]} style={styles.requestGradient}>
          <View style={styles.requestHeader}>
            <View style={styles.clientInfo}>
              <View style={[styles.clientAvatar, item.userLevel === "VIP" && styles.vipAvatar]}>
                <Icon name="account" size={24} color="rgba(255, 255, 255, 0.7)" />
                {item.userLevel === "VIP" && (
                  <View style={styles.vipBadge}>
                    <Icon name="crown" size={12} color="#FFD700" />
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.clientName}>{item.clientName}</Text>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceType}>{item.service}</Text>
                  <Text style={styles.serviceDuration}>• {item.duration}</Text>
                </View>
              </View>
            </View>
            <View style={styles.requestPriceContainer}>
              <Text style={styles.priceText}>{item.price}</Text>
              <View style={styles.tokenContainer}>
                <Icon name="coin" size={14} color="#FFD700" />
                <Text style={styles.tokenText}>{item.tokens}</Text>
              </View>
            </View>
          </View>

          <View style={styles.requestDetails}>
            <View style={styles.timeContainer}>
              <Icon name="clock-outline" size={16} color={colors.variante3} />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>

            <View style={styles.requestActions}>
              <TouchableOpacity style={styles.acceptButton}>
                <Icon name="check" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton}>
                <Icon name="close" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatButton}>
                <Icon name="chat" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar show programado
  const renderScheduledShow = ({ item }) => {
    return (
      <TouchableOpacity style={styles.showCard} activeOpacity={0.8}>
        <LinearGradient
          colors={item.type === "vip" ? ["#FFD700", "#FFA500"] : [colors.principal, colors.variante7]}
          style={styles.showGradient}
        >
          <View style={styles.showHeader}>
            <Icon name={item.type === "vip" ? "crown" : "broadcast"} size={20} color="#fff" />
            <Text style={styles.showType}>{item.type === "vip" ? "VIP" : "Público"}</Text>
          </View>
          <Text style={styles.showTitle}>{item.title}</Text>
          <Text style={styles.showDate}>{item.date}</Text>
          <View style={styles.showFooter}>
            <View style={styles.showViewers}>
              <Icon name="account-group" size={14} color="#fff" />
              <Text style={styles.showViewersText}>{item.expectedViewers}</Text>
            </View>
            <Text style={styles.showPrice}>{item.price}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar top fan
  const renderTopFan = ({ item, index }) => {
    const medals = ["gold", "silver", "#CD7F32"] // oro, plata, bronce
    return (
      <View style={styles.fanCard}>
        <View style={styles.fanRank}>
          <Icon name="medal" size={20} color={medals[index] || colors.variante3} />
          <Text style={styles.fanRankText}>#{index + 1}</Text>
        </View>
        <View style={styles.fanAvatar}>
          <Icon name="account" size={20} color="rgba(255, 255, 255, 0.7)" />
        </View>
        <Text style={styles.fanName}>{item.name}</Text>
        <View style={styles.fanTokens}>
          <Icon name="coin" size={12} color="#FFD700" />
          <Text style={styles.fanTokensText}>{item.tokens}</Text>
        </View>
        <Text style={[styles.fanLevel, { color: item.level === "VIP" ? "#FFD700" : colors.principal }]}>
          {item.level}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header mejorado */}
      <LinearGradient colors={[colors.variante1, colors.variante2]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Panel de Modelo</Text>
            <Text style={styles.userName}>{user?.displayName || "Sofía Valentina"}</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate("Notifications")}>
              <Icon name="bell" size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>5</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("ModelProfile")}>
              <Image source={require("../../assets/Imagen (1).jpg")} style={styles.avatarImage} />
              <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? colors.exito : colors.error }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.streamButton, isStreaming && styles.streamButtonActive]}
            onPress={() => setShowStreamModal(true)}
          >
            <LinearGradient
              colors={isStreaming ? [colors.error, "#FF6B6B"] : [colors.principal, colors.variante7]}
              style={styles.streamButtonGradient}
            >
              <Icon name={isStreaming ? "broadcast-off" : "broadcast"} size={20} color="#fff" />
              <Text style={styles.streamButtonText}>{isStreaming ? "Detener Stream" : "Iniciar Stream"}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.onlineToggle}>
            <Text style={styles.onlineToggleText}>Estado:</Text>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: "#767577", true: colors.principal }}
              thumbColor={isOnline ? colors.exito : "#f4f3f4"}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.principal}
            colors={[colors.principal, colors.variante7]}
          />
        }
      >
        {/* Resumen de ganancias */}
        <View style={styles.earningsCard}>
          <LinearGradient colors={[colors.principal, colors.variante7]} style={styles.earningsGradient}>
            <View style={styles.earningsHeader}>
              <Text style={styles.earningsTitle}>Ganancias del Mes</Text>
              <TouchableOpacity>
                <Icon name="chart-line" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.earningsAmount}>{stats.monthlyEarnings}</Text>
            <View style={styles.earningsDetails}>
              <View style={styles.earningItem}>
                <Text style={styles.earningLabel}>Hoy</Text>
                <Text style={styles.earningValue}>{stats.todayEarnings}</Text>
              </View>
              <View style={styles.earningDivider} />
              <View style={styles.earningItem}>
                <Text style={styles.earningLabel}>Tokens</Text>
                <Text style={styles.earningValue}>{stats.tokens}</Text>
              </View>
              <View style={styles.earningDivider} />
              <View style={styles.earningItem}>
                <Text style={styles.earningLabel}>Horas</Text>
                <Text style={styles.earningValue}>{Math.floor(stats.streamMinutes / 60)}h</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Estadísticas mejoradas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            {renderStatCard("eye", stats.views, "Visitas", colors.principal, 12)}
            {renderStatCard("heart", stats.likes, "Me gusta", colors.error, 8)}
            {renderStatCard("account-group", stats.activeSubscribers, "Suscriptores", colors.variante7, 15)}
            {renderStatCard("star", stats.rating, "Rating", "#FFD700")}
          </View>
        </View>

        {/* Shows programados */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shows Programados</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ScheduleShow")}>
              <Icon name="plus-circle" size={24} color={colors.principal} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={scheduledShows}
            renderItem={renderScheduledShow}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.showsList}
          />
        </View>

        {/* Top Fans */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Fans</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllFans")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.fansContainer}>
              {topFans.map((fan, index) => (
                <View key={fan.id}>{renderTopFan({ item: fan, index })}</View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Solicitudes privadas */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Solicitudes Privadas</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllRequests")}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={privateRequests}
            renderItem={renderPrivateRequest}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.requestsList}
          />
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modal para configurar stream */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStreamModal}
        onRequestClose={() => setShowStreamModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={[colors.variante1, colors.variante2]} style={styles.modalGradient}>
              <Text style={styles.modalTitle}>Configurar Stream</Text>

              <View style={styles.streamOptions}>
                <TouchableOpacity
                  style={[styles.streamOption, streamType === "public" && styles.streamOptionActive]}
                  onPress={() => setStreamType("public")}
                >
                  <Icon name="earth" size={24} color={streamType === "public" ? "#fff" : colors.variante3} />
                  <Text style={[styles.streamOptionText, streamType === "public" && styles.streamOptionTextActive]}>
                    Público
                  </Text>
                  <Text style={styles.streamOptionPrice}>Gratis</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.streamOption, streamType === "private" && styles.streamOptionActive]}
                  onPress={() => setStreamType("private")}
                >
                  <Icon name="lock" size={24} color={streamType === "private" ? "#fff" : colors.variante3} />
                  <Text style={[styles.streamOptionText, streamType === "private" && styles.streamOptionTextActive]}>
                    Privado
                  </Text>
                  <Text style={styles.streamOptionPrice}>$10/min</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.streamOption, streamType === "vip" && styles.streamOptionActive]}
                  onPress={() => setStreamType("vip")}
                >
                  <Icon name="crown" size={24} color={streamType === "vip" ? "#fff" : colors.variante3} />
                  <Text style={[styles.streamOptionText, streamType === "vip" && styles.streamOptionTextActive]}>
                    VIP
                  </Text>
                  <Text style={styles.streamOptionPrice}>$20/min</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowStreamModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.startStreamButton} onPress={startStreaming}>
                  <LinearGradient colors={[colors.principal, colors.variante7]} style={styles.startStreamGradient}>
                    <Icon name="broadcast" size={20} color="#fff" />
                    <Text style={styles.startStreamText}>Iniciar</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.fondoOscuro,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    marginRight: 15,
  },
  profileButton: {
    position: "relative",
  },
  avatarImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.fondoOscuro,
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streamButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  streamButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  streamButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  onlineToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  onlineToggleText: {
    color: "#fff",
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  // Estilos para la tarjeta de ganancias
  earningsCard: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  earningsGradient: {
    padding: 20,
  },
  earningsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  earningsTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  earningsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  earningItem: {
    alignItems: "center",
  },
  earningLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 5,
  },
  earningValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  earningDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  // Estilos para estadísticas mejoradas
  statsContainer: {
    paddingHorizontal: 20,
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
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  statCardGradient: {
    padding: 15,
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.luminous,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.variante3,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
  },
  // Estilos para secciones
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
  // Estilos para shows programados
  showsList: {
    paddingHorizontal: 20,
  },
  showCard: {
    width: 200,
    height: 120,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  showGradient: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  showHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  showType: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  showTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  showDate: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  showFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showViewers: {
    flexDirection: "row",
    alignItems: "center",
  },
  showViewersText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  showPrice: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Estilos para top fans
  fansContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  fanCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    alignItems: "center",
    width: 100,
  },
  fanRank: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fanRankText: {
    color: colors.luminous,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  fanAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  fanName: {
    color: colors.luminous,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },
  fanTokens: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  fanTokensText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 3,
  },
  fanLevel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  // Estilos para solicitudes mejoradas
  requestsList: {
    paddingHorizontal: 20,
  },
  requestCard: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  requestGradient: {
    padding: 15,
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
    flex: 1,
  },
  clientAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  vipAvatar: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  vipBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFD700",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.luminous,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceType: {
    fontSize: 14,
    color: colors.variante3,
  },
  serviceDuration: {
    fontSize: 14,
    color: colors.variante3,
    marginLeft: 5,
  },
  requestPriceContainer: {
    alignItems: "flex-end",
  },
  priceText: {
    color: colors.luminous,
    fontWeight: "bold",
    fontSize: 18,
  },
  tokenContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  tokenText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
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
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: colors.error,
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  chatButton: {
    backgroundColor: colors.variante7,
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomSpace: {
    height: 80,
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "85%",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
  },
  streamOptions: {
    marginBottom: 25,
  },
  streamOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  streamOptionActive: {
    borderColor: colors.principal,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  streamOptionText: {
    flex: 1,
    color: colors.variante3,
    fontSize: 16,
    marginLeft: 12,
  },
  streamOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  streamOptionPrice: {
    color: colors.luminous,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 15,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.luminous,
    fontSize: 16,
  },
  startStreamButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  startStreamGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  startStreamText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

export default ModelHomeScreen
