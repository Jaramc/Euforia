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
import colors from "../constants/colors"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.8
const CARD_HEIGHT = 250
const SPACING = 15

// Categorías para filtrar modelos destacados
const CATEGORIES = [
  { id: "all", name: "Todos", icon: "view-grid" },
  { id: "premium", name: "Premium", icon: "diamond" },
  { id: "trending", name: "Tendencia", icon: "trending-up" },
  { id: "top", name: "Top Rated", icon: "trophy" },
  { id: "new", name: "Nuevos", icon: "star" },
]

// Datos de ejemplo para modelos destacados
const FEATURED_MODELS = [
  {
    id: "1",
    name: "Sofía Valentina",
    image: require("../../assets/Imagen (1).jpg"),
    rating: 4.9,
    reviews: 128,
    price: "$150",
    followers: 12500,
    category: "premium",
    description: "Modelo premium con shows exclusivos y contenido personalizado",
    tags: ["VIP", "Shows Privados", "Chat 24/7"],
    isOnline: true,
  },
  {
    id: "2",
    name: "Camila Rodríguez",
    image: require("../../assets/Imagen (2).jpg"),
    rating: 4.7,
    reviews: 93,
    price: "$120",
    followers: 9800,
    category: "trending",
    description: "Sesiones interactivas y shows temáticos cada semana",
    tags: ["Tendencia", "Shows Temáticos", "Interactiva"],
    isOnline: true,
  },
  {
    id: "3",
    name: "Valentina Gómez",
    image: require("../../assets/Imagen (3).jpg"),
    rating: 4.8,
    reviews: 74,
    price: "$180",
    followers: 11200,
    category: "premium",
    description: "Experiencia VIP con atención personalizada y contenido exclusivo",
    tags: ["Premium", "Contenido Exclusivo", "Personalizado"],
    isOnline: false,
  },
  {
    id: "4",
    name: "Isabella Martínez",
    image: require("../../assets/Imagen (4).jpg"),
    rating: 4.5,
    reviews: 62,
    price: "$100",
    followers: 8500,
    category: "top",
    description: "Una de las modelos mejor valoradas con shows de alta calidad",
    tags: ["Top Rated", "Alta Calidad", "Profesional"],
    isOnline: true,
  },
  {
    id: "5",
    name: "Luciana Herrera",
    image: require("../../assets/Imagen (10).jpg"),
    rating: 4.6,
    reviews: 48,
    price: "$130",
    followers: 7600,
    category: "trending",
    description: "Creciendo rápidamente en popularidad con shows innovadores",
    tags: ["Tendencia", "Innovadora", "Creativa"],
    isOnline: false,
  },
  {
    id: "6",
    name: "Natalia Jiménez",
    image: require("../../assets/Imagen (11).jpg"),
    rating: 4.9,
    reviews: 83,
    price: "$170",
    followers: 13800,
    category: "premium",
    description: "Experiencia premium con shows exclusivos y atención VIP",
    tags: ["Premium", "Exclusiva", "VIP"],
    isOnline: true,
  },
  {
    id: "7",
    name: "Carolina Pérez",
    image: require("../../assets/Imagen (9).jpg"),
    rating: 4.8,
    reviews: 67,
    price: "$160",
    followers: 10200,
    category: "top",
    description: "Entre las mejores modelos con shows de alta calidad",
    tags: ["Top Rated", "Profesional", "Calidad"],
    isOnline: true,
  },
  {
    id: "8",
    name: "Fernanda Ortiz",
    image: require("../../assets/Imagen (14).jpg"),
    rating: 4.9,
    reviews: 91,
    price: "$180",
    followers: 14500,
    category: "premium",
    description: "La experiencia más exclusiva con atención personalizada",
    tags: ["Premium", "Exclusiva", "Personalizada"],
    isOnline: true,
  },
]

const MilistScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [filteredModels, setFilteredModels] = useState(FEATURED_MODELS)
  const scrollY = new Animated.Value(0)

  // Efecto para filtrar modelos basados en la búsqueda y categoría
  useEffect(() => {
    let filtered = [...FEATURED_MODELS]

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter((model) => model.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((model) => model.category === selectedCategory)
    }

    setFilteredModels(filtered)
  }, [searchQuery, selectedCategory])

  // Función para simular una actualización
  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  // Renderizar una tarjeta de modelo destacado
  const renderFeaturedItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : SPACING }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ModelDetails", { model: item })}
      >
        <Image source={item.image} style={styles.featuredImage} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.9)"]} style={styles.featuredGradient}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredName}>{item.name}</Text>
              {item.isOnline && (
                <View style={styles.onlineIndicator}>
                  <Text style={styles.onlineText}>En línea</Text>
                </View>
              )}
            </View>

            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 2).map((tag, idx) => (
                <View key={idx} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>

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

        {item.category === "premium" && (
          <View style={styles.premiumBadge}>
            <Icon name="diamond" size={14} color="#fff" />
            <Text style={styles.badgeText}>PREMIUM</Text>
          </View>
        )}

        {item.category === "trending" && (
          <View style={[styles.premiumBadge, styles.trendingBadge]}>
            <Icon name="trending-up" size={14} color="#fff" />
            <Text style={styles.badgeText}>TRENDING</Text>
          </View>
        )}

        <View style={styles.followersContainer}>
          <Icon name="account-group" size={14} color="#fff" />
          <Text style={styles.followersText}>
            {item.followers > 9999 ? `${(item.followers / 1000).toFixed(1)}K` : item.followers}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizar una tarjeta de modelo en la cuadrícula
  const renderGridItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.gridCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ModelDetails", { model: item })}
      >
        <Image source={item.image} style={styles.gridImage} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gridGradient}>
          <View style={styles.gridContent}>
            <Text style={styles.gridName}>{item.name}</Text>
            <View style={styles.gridRating}>
              <Icon name="star" size={12} color="#FFD700" />
              <Text style={styles.gridRatingText}>{item.rating}</Text>
            </View>
          </View>
        </LinearGradient>

        {item.isOnline && <View style={styles.gridOnlineIndicator} />}

        {item.category === "premium" && (
          <View style={styles.gridBadge}>
            <Icon name="diamond" size={10} color="#fff" />
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
        <Text style={styles.headerTitle}>Modelos Destacados</Text>
        <TouchableOpacity style={styles.filterIconButton}>
          <Icon name="tune-vertical" size={24} color="#fff" />
        </TouchableOpacity>
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
              placeholder="Buscar modelos..."
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

          <TouchableOpacity style={styles.sortButton}>
            <Icon name="sort" size={22} color="#fff" />
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

        {/* Modelos Premium */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Premium</Text>
            <TouchableOpacity onPress={() => setSelectedCategory("premium")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={FEATURED_MODELS.filter((model) => model.category === "premium")}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Modelos en Tendencia */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En Tendencia</Text>
            <TouchableOpacity onPress={() => setSelectedCategory("trending")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={FEATURED_MODELS.filter((model) => model.category === "trending")}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Todos los modelos destacados */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todos los Destacados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {filteredModels.length > 0 ? (
            <View style={styles.gridContainer}>
              {filteredModels.map((model) => (
                <View key={model.id} style={styles.gridItemWrapper}>
                  {renderGridItem({ item: model })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="emoticon-sad-outline" size={50} color={colors.variante3} />
              <Text style={styles.emptyText}>No se encontraron modelos</Text>
              <Text style={styles.emptySubtext}>Intenta con otra búsqueda o categoría</Text>
            </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.luminous,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
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
  sortButton: {
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
  // Estilos para modelos destacados
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
    height: "70%",
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
    fontSize: 20,
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
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  descriptionText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginBottom: 10,
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
  premiumBadge: {
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
  trendingBadge: {
    backgroundColor: "#FF6B6B",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    marginLeft: 3,
  },
  followersContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  followersText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
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
  gridContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  gridName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
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
  gridBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.principal,
    justifyContent: "center",
    alignItems: "center",
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
  bottomSpace: {
    height: 80,
  },
})

export default MilistScreen
