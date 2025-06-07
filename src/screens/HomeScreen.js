"use client"

import { useState } from "react"
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
  Modal,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width, height } = Dimensions.get("window")
const CARD_WIDTH = width * 0.7
const CARD_HEIGHT = 200

// Categorías actualizadas
const CATEGORIES = [
  { id: "all", name: "Todos", icon: "view-grid" },
  { id: "online", name: "En Vivo", icon: "broadcast", color: colors.exito },
  { id: "vip", name: "VIP", icon: "crown", color: "#FFD700" },
  { id: "new", name: "Nuevos", icon: "star" },
  { id: "popular", name: "Populares", icon: "fire" },
  { id: "nearby", name: "Cercanos", icon: "map-marker" },
]

// Datos mejorados de modelos
const MODELS_DATA = [
  {
    id: "1",
    name: "Sofía Valentina",
    image: require("../../assets/Imagen (1).jpg"),
    rating: 4.9,
    reviews: 128,
    pricePerMinute: 15,
    followers: 12500,
    category: "vip",
    isOnline: true,
    isStreaming: true,
    viewers: 234,
    tags: ["Latina", "Curvy", "Interactive"],
    description: "Modelo premium con shows exclusivos",
    languages: ["Español", "English"],
    schedule: "Lun-Vie 20:00-02:00",
  },
  {
    id: "2",
    name: "Camila Rodríguez",
    image: require("../../assets/Imagen (2).jpg"),
    rating: 4.7,
    reviews: 93,
    pricePerMinute: 12,
    followers: 9800,
    category: "popular",
    isOnline: true,
    isStreaming: false,
    viewers: 0,
    tags: ["Petite", "Toys", "Roleplay"],
    description: "Shows temáticos cada semana",
    languages: ["Español"],
    schedule: "Mar-Sab 21:00-03:00",
  },
  {
    id: "3",
    name: "Valentina Gómez",
    image: require("../../assets/Imagen (3).jpg"),
    rating: 4.8,
    reviews: 74,
    pricePerMinute: 18,
    followers: 11200,
    category: "new",
    isOnline: false,
    isStreaming: false,
    viewers: 0,
    tags: ["MILF", "Dominatrix", "Fetish"],
    description: "Experiencia VIP personalizada",
    languages: ["Español", "Português"],
    schedule: "Lun-Dom 19:00-01:00",
  },
]

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [userTokens, setUserTokens] = useState(5000) // Tokens del usuario
  const [favorites, setFavorites] = useState([])
  const scrollY = new Animated.Value(0)

  // Estados para filtros
  const [filters, setFilters] = useState({
    priceRange: [0, 50],
    languages: [],
    tags: [],
    onlineOnly: false,
    streamingOnly: false,
  })

  // Función para alternar favoritos
  const toggleFavorite = (modelId) => {
    if (favorites.includes(modelId)) {
      setFavorites(favorites.filter((id) => id !== modelId))
    } else {
      setFavorites([...favorites, modelId])
    }
  }

  // Función para simular una actualización
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  // Renderizar tarjeta de modelo mejorada
  const renderModelCard = ({ item, index }) => {
    const isFavorite = favorites.includes(item.id)

    return (
      <TouchableOpacity
        style={[styles.modelCard, { marginLeft: index === 0 ? 20 : 10 }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ModelProfile", { model: item })}
      >
        <Image source={item.image} style={styles.modelImage} />

        {/* Indicadores de estado */}
        {item.isStreaming && (
          <View style={styles.streamingBadge}>
            <Icon name="broadcast" size={12} color="#fff" />
            <Text style={styles.streamingText}>EN VIVO</Text>
            <Text style={styles.viewersText}>{item.viewers}</Text>
          </View>
        )}

        {item.isOnline && !item.isStreaming && (
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>En línea</Text>
          </View>
        )}

        {/* Botón de favorito */}
        <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
          <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? colors.error : "#fff"} />
        </TouchableOpacity>

        <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={styles.modelGradient}>
          <View style={styles.modelContent}>
            <View style={styles.modelHeader}>
              <Text style={styles.modelName}>{item.name}</Text>
              {item.category === "vip" && (
                <View style={styles.vipBadge}>
                  <Icon name="crown" size={12} color="#fff" />
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              )}
            </View>

            <View style={styles.modelTags}>
              {item.tags.slice(0, 3).map((tag, idx) => (
                <View key={idx} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modelFooter}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>

              <View style={styles.priceContainer}>
                <Icon name="coin" size={14} color="#FFD700" />
                <Text style={styles.priceText}>{item.pricePerMinute}/min</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar modelo en cuadrícula
  const renderGridModel = ({ item }) => {
    const isFavorite = favorites.includes(item.id)

    return (
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ModelProfile", { model: item })}
      >
        <Image source={item.image} style={styles.gridImage} />

        {item.isStreaming && (
          <View style={styles.gridStreamingBadge}>
            <Icon name="broadcast" size={10} color="#fff" />
            <Text style={styles.gridStreamingText}>{item.viewers}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.gridFavoriteButton} onPress={() => toggleFavorite(item.id)}>
          <Icon name={isFavorite ? "heart" : "heart-outline"} size={18} color={isFavorite ? colors.error : "#fff"} />
        </TouchableOpacity>

        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gridGradient}>
          <Text style={styles.gridName}>{item.name}</Text>
          <View style={styles.gridInfo}>
            <View style={styles.gridRating}>
              <Icon name="star" size={10} color="#FFD700" />
              <Text style={styles.gridRatingText}>{item.rating}</Text>
            </View>
            <Text style={styles.gridPrice}>${item.pricePerMinute}/min</Text>
          </View>
        </LinearGradient>

        {item.isOnline && <View style={styles.gridOnlineIndicator} />}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header mejorado */}
      <LinearGradient colors={[colors.variante1, colors.variante2]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.userName}>{user?.displayName || "Usuario"}</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Balance de tokens */}
            <TouchableOpacity style={styles.tokenBalance} onPress={() => navigation.navigate("BuyTokens")}>
              <Icon name="coin" size={20} color="#FFD700" />
              <Text style={styles.tokenText}>{userTokens}</Text>
              <Icon name="plus-circle" size={16} color="#fff" />
            </TouchableOpacity>

            {/* Notificaciones */}
            <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate("Notifications")}>
              <Icon name="bell" size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de búsqueda mejorada */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={22} color={colors.variante3} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar modelos, tags..."
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

          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
            <Icon name="filter-variant" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.principal} />}
      >
        {/* Categorías */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
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
                color={selectedCategory === category.id ? "#fff" : category.color || colors.variante3}
              />
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
                {category.name}
              </Text>
              {category.id === "online" && <View style={styles.liveIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Modelos en vivo */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="broadcast" size={20} color={colors.error} />
              <Text style={styles.sectionTitle}>En Vivo Ahora</Text>
              <View style={styles.liveIndicator} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("LiveModels")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={MODELS_DATA.filter((m) => m.isStreaming)}
            renderItem={renderModelCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 10}
            decelerationRate="fast"
          />
        </View>

        {/* Modelos VIP */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="crown" size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Modelos VIP</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("VIPModels")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={MODELS_DATA.filter((m) => m.category === "vip")}
            renderItem={renderModelCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 10}
            decelerationRate="fast"
          />
        </View>

        {/* Todos los modelos */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explorar Modelos</Text>
            <TouchableOpacity>
              <Icon name="view-module" size={24} color={colors.principal} />
            </TouchableOpacity>
          </View>

          <View style={styles.gridContainer}>
            {MODELS_DATA.map((model) => (
              <View key={model.id} style={styles.gridItemWrapper}>
                {renderGridModel({ item: model })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modal de filtros */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Filtros de estado */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Estado</Text>
                <TouchableOpacity
                  style={[styles.filterOption, filters.onlineOnly && styles.filterOptionActive]}
                  onPress={() => setFilters({ ...filters, onlineOnly: !filters.onlineOnly })}
                >
                  <Icon name="circle" size={16} color={filters.onlineOnly ? colors.principal : colors.variante3} />
                  <Text style={styles.filterOptionText}>Solo en línea</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, filters.streamingOnly && styles.filterOptionActive]}
                  onPress={() => setFilters({ ...filters, streamingOnly: !filters.streamingOnly })}
                >
                  <Icon
                    name="broadcast"
                    size={16}
                    color={filters.streamingOnly ? colors.principal : colors.variante3}
                  />
                  <Text style={styles.filterOptionText}>Solo en vivo</Text>
                </TouchableOpacity>
              </View>

              {/* Rango de precio */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Precio por minuto</Text>
                <View style={styles.priceRange}>
                  <Text style={styles.priceRangeText}>$0 - $50</Text>
                </View>
              </View>

              {/* Idiomas */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Idiomas</Text>
                <View style={styles.languageOptions}>
                  {["Español", "English", "Português"].map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[styles.languageChip, filters.languages.includes(lang) && styles.languageChipActive]}
                      onPress={() => {
                        const newLangs = filters.languages.includes(lang)
                          ? filters.languages.filter((l) => l !== lang)
                          : [...filters.languages, lang]
                        setFilters({ ...filters, languages: newLangs })
                      }}
                    >
                      <Text
                        style={[
                          styles.languageChipText,
                          filters.languages.includes(lang) && styles.languageChipTextActive,
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() =>
                  setFilters({
                    priceRange: [0, 50],
                    languages: [],
                    tags: [],
                    onlineOnly: false,
                    streamingOnly: false,
                  })
                }
              >
                <Text style={styles.clearButtonText}>Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
                <LinearGradient colors={[colors.principal, colors.variante7]} style={styles.applyButtonGradient}>
                  <Text style={styles.applyButtonText}>Aplicar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenBalance: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 15,
  },
  tokenText: {
    color: "#fff",
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  notificationButton: {
    position: "relative",
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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
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
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: colors.principal,
  },
  categoryText: {
    color: colors.variante3,
    marginLeft: 6,
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginLeft: 6,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.luminous,
    marginLeft: 8,
  },
  seeAllText: {
    color: colors.principal,
    fontSize: 14,
  },
  // Estilos para tarjetas de modelos
  modelCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 10,
  },
  modelImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  modelGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    padding: 15,
    justifyContent: "flex-end",
  },
  modelContent: {
    justifyContent: "space-between",
  },
  modelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  vipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  vipText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 3,
  },
  modelTags: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  modelFooter: {
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 3,
  },
  streamingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  streamingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
    marginRight: 4,
  },
  viewersText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  onlineBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 180, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 4,
  },
  onlineText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilos para la cuadrícula
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
  },
  gridItemWrapper: {
    width: "50%",
    padding: 5,
  },
  gridCard: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gridGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    padding: 10,
    justifyContent: "flex-end",
  },
  gridName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gridInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gridRatingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 3,
  },
  gridPrice: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  gridOnlineIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.exito,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.5)",
  },
  gridStreamingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gridStreamingText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    marginLeft: 3,
  },
  gridFavoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilos para el modal de filtros
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.fondoOscuro,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.luminous,
  },
  modalBody: {
    maxHeight: height * 0.6,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.luminous,
    marginBottom: 15,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  filterOptionActive: {
    borderBottomColor: colors.principal,
  },
  filterOptionText: {
    color: colors.variante3,
    marginLeft: 10,
    fontSize: 16,
  },
  priceRange: {
    alignItems: "center",
    marginTop: 10,
  },
  priceRangeText: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
  },
  languageOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  languageChip: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  languageChipActive: {
    backgroundColor: colors.principal,
  },
  languageChipText: {
    color: colors.variante3,
    fontSize: 14,
  },
  languageChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginRight: 10,
  },
  clearButtonText: {
    color: colors.luminous,
    fontSize: 16,
  },
  applyButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  applyButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSpace: {
    height: 80,
  },
})

export default HomeScreen
