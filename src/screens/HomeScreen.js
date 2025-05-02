"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  RefreshControl,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.7
const CARD_HEIGHT = 200
const SPACING = 10

// Datos de ejemplo para el catálogo
const CATEGORIES = [
  { id: "all", name: "Todos", icon: "view-grid" },
  { id: "vip", name: "VIP", icon: "crown" },
  { id: "new", name: "Nuevos", icon: "star" },
  { id: "popular", name: "Populares", icon: "fire" },
  { id: "nearby", name: "Cercanos", icon: "map-marker" },
]

// Datos de ejemplo para chats recientes
const RECENT_CHATS = [
  {
    id: "chat1",
    name: "Sofía Valentina",
    image: require("../../assets/Imagen (1).jpg"),
    lastMessage: "¿Quieres ver mi show privado esta noche?",
    time: "12:30",
    unread: 2,
    isOnline: true,
  },
  {
    id: "chat2",
    name: "Camila Rodríguez",
    image: require("../../assets/Imagen (2).jpg"),
    lastMessage: "Te espero en mi sala VIP, tengo sorpresas...",
    time: "10:45",
    unread: 0,
    isOnline: true,
  },
  {
    id: "chat3",
    name: "Valentina Gómez",
    image: require("../../assets/Imagen (3).jpg"),
    lastMessage: "¿Te gustó mi último show? Puedo hacer más...",
    time: "Ayer",
    unread: 1,
    isOnline: false,
  },
  {
    id: "chat4",
    name: "Isabella Martínez",
    image: require("../../assets/Imagen (4).jpg"),
    lastMessage: "Tengo nuevos conjuntos para mostrarte 🔥",
    time: "Ayer",
    unread: 0,
    isOnline: true,
  },
  {
    id: "chat5",
    name: "Luciana Herrera",
    image: require("../../assets/Imagen (10).jpg"),
    lastMessage: "¿Quieres una sesión privada? Estoy disponible",
    time: "Lun",
    unread: 3,
    isOnline: false,
  },
]

// Datos de ejemplo para servicios destacados
const FEATURED_SERVICES = [
  {
    id: "1",
    name: "Sofía Valentina",
    image: require("../../assets/Imagen (1).jpg"),
    rating: 4.9,
    reviews: 128,
    price: "$150",
    distance: "2.5 km",
    category: "vip",
    isOnline: true,
  },
  {
    id: "2",
    name: "Camila Rodríguez",
    image: require("../../assets/Imagen (2).jpg"),
    rating: 4.7,
    reviews: 93,
    price: "$120",
    distance: "3.8 km",
    category: "popular",
    isOnline: true,
  },
  {
    id: "3",
    name: "Valentina Gómez",
    image: require("../../assets/Imagen (3).jpg"),
    rating: 4.8,
    reviews: 74,
    price: "$180",
    distance: "1.2 km",
    category: "new",
    isOnline: false,
  },
]

// Datos de ejemplo para servicios regulares
const SERVICES = [
  {
    id: "4",
    name: "Isabella Martínez",
    image: require("../../assets/Imagen (4).jpg"),
    rating: 4.5,
    reviews: 62,
    price: "$100",
    distance: "4.3 km",
    category: "popular",
    isOnline: true,
  },
  {
    id: "5",
    name: "Luciana Herrera",
    image: require("../../assets/Imagen (10).jpg"),
    rating: 4.6,
    reviews: 48,
    price: "$130",
    distance: "5.1 km",
    category: "nearby",
    isOnline: false,
  },
  {
    id: "6",
    name: "Mariana López",
    image: require("../../assets/Imagen (5).jpg"),
    rating: 4.4,
    reviews: 37,
    price: "$90",
    distance: "2.8 km",
    category: "new",
    isOnline: true,
  },
  {
    id: "7",
    name: "Daniela Torres",
    image: require("../../assets/Imagen (6).jpg"),
    rating: 4.3,
    reviews: 29,
    price: "$110",
    distance: "3.5 km",
    category: "nearby",
    isOnline: false,
  },
  {
    id: "8",
    name: "Gabriela Díaz",
    image: require("../../assets/Imagen (7).jpg"),
    rating: 4.7,
    reviews: 52,
    price: "$140",
    distance: "1.9 km",
    category: "vip",
    isOnline: true,
  },
  {
    id: "9",
    name: "Carolina Pérez",
    image: require("../../assets/Imagen (9).jpg"),
    rating: 4.8,
    reviews: 67,
    price: "$160",
    distance: "2.2 km",
    category: "vip",
    isOnline: true,
  },
  {
    id: "10",
    name: "Andrea Sánchez",
    image: require("../../assets/Imagen (8).jpg"),
    rating: 4.6,
    reviews: 45,
    price: "$120",
    distance: "3.1 km",
    category: "popular",
    isOnline: false,
  },
  {
    id: "11",
    name: "Natalia Jiménez",
    image: require("../../assets/Imagen (11).jpg"),
    rating: 4.9,
    reviews: 83,
    price: "$170",
    distance: "1.7 km",
    category: "vip",
    isOnline: true,
  },
  {
    id: "12",
    name: "Valeria Morales",
    image: require("../../assets/Imagen (13).jpg"),
    rating: 4.5,
    reviews: 41,
    price: "$140",
    distance: "3.9 km",
    category: "new",
    isOnline: true,
  },
  {
    id: "13",
    name: "Laura Mendoza",
    image: require("../../assets/Imagen (12).jpg"),
    rating: 4.7,
    reviews: 59,
    price: "$150",
    distance: "2.6 km",
    category: "popular",
    isOnline: false,
  },
  {
    id: "14",
    name: "Paula Vargas",
    image: require("../../assets/Imagen (1).jpeg"),
    rating: 4.8,
    reviews: 72,
    price: "$160",
    distance: "1.5 km",
    category: "vip",
    isOnline: true,
  },
  {
    id: "15",
    name: "Alejandra Castro",
    image: require("../../assets/Imagen (15).jpg"),
    rating: 4.4,
    reviews: 38,
    price: "$120",
    distance: "4.2 km",
    category: "nearby",
    isOnline: true,
  },
  {
    id: "16",
    name: "Fernanda Ortiz",
    image: require("../../assets/Imagen (14).jpg"),
    rating: 4.9,
    reviews: 91,
    price: "$180",
    distance: "2.0 km",
    category: "vip",
    isOnline: true,
  },
]

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [filteredServices, setFilteredServices] = useState(SERVICES)
  const scrollY = new Animated.Value(0)

  // Efecto para filtrar servicios basados en la búsqueda y categoría
  useEffect(() => {
    let filtered = [...SERVICES]

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter((service) => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    setFilteredServices(filtered)
  }, [searchQuery, selectedCategory])

  // Función para simular una actualización
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  // Renderizar un elemento de chat reciente
  const renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ChatDetail", { chat: item })}
      >
        <View style={styles.chatAvatarContainer}>
          <Image source={item.image} style={styles.chatAvatar} />
          {item.isOnline && <View style={styles.chatOnlineIndicator} />}
        </View>
        <View style={styles.chatInfo}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.chatLastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.chatTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.chatUnreadBadge}>
              <Text style={styles.chatUnreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizar una tarjeta de servicio destacado
  const renderFeaturedItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : SPACING }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ServiceDetails", { service: item })}
      >
        <Image source={item.image} style={styles.featuredImage} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.featuredGradient}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredName}>{item.name}</Text>
              {item.isOnline && (
                <View style={styles.onlineIndicator}>
                  <Text style={styles.onlineText}>En línea</Text>
                </View>
              )}
            </View>

            <View style={styles.featuredFooter}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {item.category === "vip" && (
          <View style={styles.vipBadge}>
            <Icon name="crown" size={14} color="#fff" />
            <Text style={styles.vipText}>VIP</Text>
          </View>
        )}

        {item.category === "new" && (
          <View style={[styles.vipBadge, styles.newBadge]}>
            <Icon name="star" size={14} color="#fff" />
            <Text style={styles.vipText}>NUEVO</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  // Renderizar una tarjeta de servicio regular
  const renderServiceItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.serviceCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ServiceDetails", { service: item })}
      >
        <Image source={item.image} style={styles.serviceImage} />
        <View style={styles.serviceContent}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{item.name}</Text>
            {item.isOnline && <View style={styles.serviceOnlineIndicator} />}
          </View>

          <View style={styles.serviceDetails}>
            <View style={styles.serviceRating}>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.serviceRatingText}>{item.rating}</Text>
            </View>

            <View style={styles.serviceDistance}>
              <Icon name="map-marker" size={14} color={colors.variante3} />
              <Text style={styles.serviceDistanceText}>{item.distance}</Text>
            </View>
          </View>

          <View style={styles.serviceFooter}>
            <Text style={styles.servicePriceText}>{item.price}</Text>
            <TouchableOpacity style={styles.chatButton}>
              <Icon name="chat" size={16} color="#fff" />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.category === "vip" && (
          <View style={[styles.serviceBadge, styles.serviceVipBadge]}>
            <Icon name="crown" size={12} color="#fff" />
          </View>
        )}

        {item.category === "new" && (
          <View style={[styles.serviceBadge, styles.serviceNewBadge]}>
            <Icon name="star" size={12} color="#fff" />
          </View>
        )}
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
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.userName}>{user?.displayName || "Usuario"}</Text>
          </View>

          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("MyAccount")}>
            <View style={styles.avatarContainer}>
              <Icon name="account" size={24} color="#fff" />
            </View>
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
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={22} color={colors.variante3} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar servicios..."
              placeholderTextColor={colors.variante3}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon name="close-circle" size={18} color={colors.variante3} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-variant" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Categorías */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon
                  name={category.icon}
                  size={20}
                  color={selectedCategory === category.id ? "#fff" : colors.variante3}
                />
                <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chats recientes */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chats recientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Chats")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={RECENT_CHATS}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            horizontal={false}
            scrollEnabled={false}
            contentContainerStyle={styles.chatsList}
          />
        </View>

        {/* Servicios destacados */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destacados</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Mas destacado⭐")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={FEATURED_SERVICES}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Servicios disponibles */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servicios disponibles</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {filteredServices.length > 0 ? (
            <FlatList
              data={filteredServices.slice(0, 6)} // Limitamos a 6 para no hacer la lista muy larga
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="emoticon-sad-outline" size={50} color={colors.variante3} />
              <Text style={styles.emptyText}>No se encontraron servicios</Text>
              <Text style={styles.emptySubtext}>Intenta con otra búsqueda o categoría</Text>
            </View>
          )}

          {filteredServices.length > 6 && (
            <TouchableOpacity style={styles.showMoreButton} onPress={() => navigation.navigate("AllServices")}>
              <Text style={styles.showMoreText}>Mostrar más servicios</Text>
              <Icon name="chevron-down" size={20} color={colors.principal} />
            </TouchableOpacity>
          )}
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
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.principal,
    justifyContent: "center",
    alignItems: "center",
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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 46,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.luminous,
    fontSize: 16,
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: colors.principal,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScrollView: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: colors.principal,
  },
  categoryText: {
    color: colors.variante3,
    marginLeft: 5,
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
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
  // Estilos para los chats recientes
  chatsList: {
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  chatAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatOnlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.exito,
    borderWidth: 2,
    borderColor: colors.fondoOscuro,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatName: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  chatLastMessage: {
    color: colors.variante3,
    fontSize: 14,
  },
  chatMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  chatTime: {
    color: colors.variante3,
    fontSize: 12,
    marginBottom: 5,
  },
  chatUnreadBadge: {
    backgroundColor: colors.principal,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chatUnreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Estilos para servicios destacados
  featuredList: {
    paddingRight: 20,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 15,
  },
  featuredContent: {
    justifyContent: "space-between",
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  onlineIndicator: {
    backgroundColor: colors.exito,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  onlineText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginLeft: 3,
    fontSize: 12,
  },
  priceContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  vipBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.principal,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  newBadge: {
    backgroundColor: colors.exito,
  },
  vipText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    marginLeft: 3,
  },
  // Estilos para servicios regulares
  servicesList: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    height: 100,
  },
  serviceImage: {
    width: 100,
    height: "100%",
    resizeMode: "cover",
  },
  serviceContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.luminous,
    flex: 1,
  },
  serviceOnlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.exito,
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceRating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  serviceRatingText: {
    color: colors.variante3,
    marginLeft: 4,
    fontSize: 12,
  },
  serviceDistance: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceDistanceText: {
    color: colors.variante3,
    marginLeft: 4,
    fontSize: 12,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  servicePriceText: {
    color: colors.luminous,
    fontWeight: "bold",
    fontSize: 16,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.principal,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  chatButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  serviceBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceVipBadge: {
    backgroundColor: colors.principal,
  },
  serviceNewBadge: {
    backgroundColor: colors.exito,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    marginHorizontal: 20,
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
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  showMoreText: {
    color: colors.principal,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 5,
  },
  bottomSpace: {
    height: 80,
  },
})

export default HomeScreen
