"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
  Share,
  ImageBackground,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width, height } = Dimensions.get("window")
const HEADER_MAX_HEIGHT = 300
const HEADER_MIN_HEIGHT = 90
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

// Datos de ejemplo para el perfil de modelo
const MODEL_DATA = {
  id: "1",
  name: "Sofía Valentina",
  image: require("../../assets/Imagen (1).jpg"),
  coverImage: require("../../assets/Imagen (15).jpg"),
  rating: 4.9,
  reviews: 128,
  pricePerMinute: 15,
  followers: 12500,
  category: "vip",
  isOnline: true,
  isStreaming: false,
  bio: "Hola a todos 👋 Soy Sofía, modelo profesional con 3 años de experiencia. Me encanta conectar con mis fans y crear momentos especiales. Disfruto del baile, la música y las conversaciones interesantes. ¡Espero verte pronto en mis shows! 💕",
  tags: ["Latina", "Curvy", "Interactive", "Dance", "Roleplay", "Lingerie"],
  languages: ["Español", "English"],
  schedule: "Lun-Vie 20:00-02:00",
  location: "Bogotá, Colombia",
  age: 25,
  height: "168 cm",
  measurements: "90-60-90",
  hairColor: "Castaño",
  eyeColor: "Café",
  services: [
    { id: "service1", name: "Chat privado", price: 15, icon: "chat" },
    { id: "service2", name: "Videollamada", price: 30, icon: "video" },
    { id: "service3", name: "Fotos personalizadas", price: 50, icon: "camera" },
    { id: "service4", name: "Shows temáticos", price: 100, icon: "theater" },
  ],
}

// Datos de ejemplo para las galerías
const GALLERIES = [
  {
    id: "gallery1",
    title: "Sesión de playa",
    coverImage: require("../../assets/Imagen (2).jpg"),
    images: [
      require("../../assets/Imagen (2).jpg"),
      require("../../assets/Imagen (3).jpg"),
      require("../../assets/Imagen (4).jpg"),
    ],
    price: 50,
    isLocked: true,
  },
  {
    id: "gallery2",
    title: "Lencería",
    coverImage: require("../../assets/Imagen (5).jpg"),
    images: [
      require("../../assets/Imagen (5).jpg"),
      require("../../assets/Imagen (6).jpg"),
      require("../../assets/Imagen (7).jpg"),
    ],
    price: 80,
    isLocked: true,
  },
  {
    id: "gallery3",
    title: "Casual",
    coverImage: require("../../assets/Imagen (8).jpg"),
    images: [
      require("../../assets/Imagen (8).jpg"),
      require("../../assets/Imagen (9).jpg"),
      require("../../assets/Imagen (10).jpg"),
    ],
    price: 0,
    isLocked: false,
  },
]

// Datos de ejemplo para los próximos shows
const UPCOMING_SHOWS = [
  {
    id: "show1",
    title: "Viernes de baile",
    date: "Viernes, 20:00",
    description: "Show especial con música y baile",
    price: 0,
    type: "public",
  },
  {
    id: "show2",
    title: "Noche de lencería",
    date: "Sábado, 22:00",
    description: "Sesión exclusiva con mi nueva colección",
    price: 50,
    type: "vip",
  },
]

// Datos de ejemplo para las reseñas
const REVIEWS = [
  {
    id: "review1",
    userId: "user1",
    userName: "Carlos_M",
    rating: 5,
    comment: "Increíble show, muy profesional y atenta. Definitivamente volveré.",
    date: "Hace 2 días",
    userLevel: "vip",
  },
  {
    id: "review2",
    userId: "user2",
    userName: "Roberto_S",
    rating: 4,
    comment: "Excelente atención, muy recomendada.",
    date: "Hace 1 semana",
    userLevel: "premium",
  },
  {
    id: "review3",
    userId: "user3",
    userName: "Miguel_A",
    rating: 5,
    comment: "La mejor modelo de la plataforma, siempre cumple con lo prometido.",
    date: "Hace 2 semanas",
    userLevel: "regular",
  },
]

const ModelProfileScreen = ({ route, navigation }) => {
  const { user } = useAuth()
  const [modelData, setModelData] = useState(MODEL_DATA)
  const [activeTab, setActiveTab] = useState("about")
  const [isFollowing, setIsFollowing] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState(null)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [userTokens, setUserTokens] = useState(5000) // Tokens del usuario
  const scrollY = useRef(new Animated.Value(0)).current

  // Animaciones para el header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  })

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  })

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  })

  // Función para compartir perfil
  const shareProfile = async () => {
    try {
      await Share.share({
        message: `Mira el perfil de ${modelData.name} en Euforia: https://euforia.app/model/${modelData.id}`,
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  // Función para seguir/dejar de seguir
  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  // Función para abrir modal de galería
  const openGallery = (gallery) => {
    setSelectedGallery(gallery)
    setShowGalleryModal(true)
  }

  // Función para abrir modal de servicio
  const openService = (service) => {
    setSelectedService(service)
    setShowServiceModal(true)
  }

  // Función para comprar galería
  const purchaseGallery = () => {
    if (!selectedGallery) return
    if (userTokens < selectedGallery.price) {
      // Mostrar mensaje de tokens insuficientes
      return
    }

    setUserTokens(userTokens - selectedGallery.price)
    // Actualizar galería como desbloqueada
    setShowGalleryModal(false)
  }

  // Función para solicitar servicio
  const requestService = () => {
    if (!selectedService) return
    if (userTokens < selectedService.price) {
      // Mostrar mensaje de tokens insuficientes
      return
    }

    // Navegar a la pantalla de chat privado o videollamada
    if (selectedService.name === "Chat privado") {
      navigation.navigate("PrivateChat", { modelId: modelData.id })
    } else if (selectedService.name === "Videollamada") {
      navigation.navigate("VideoCall", { modelId: modelData.id })
    }

    setShowServiceModal(false)
  }

  // Renderizar una galería
  const renderGallery = ({ item }) => {
    return (
      <TouchableOpacity style={styles.galleryCard} onPress={() => openGallery(item)}>
        <Image source={item.coverImage} style={styles.galleryCover} />
        {item.isLocked && (
          <View style={styles.galleryLockOverlay}>
            <Icon name="lock" size={24} color="#fff" />
          </View>
        )}
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.galleryGradient}>
          <Text style={styles.galleryTitle}>{item.title}</Text>
          <View style={styles.galleryInfo}>
            <Text style={styles.galleryImagesCount}>{item.images.length} fotos</Text>
            {item.price > 0 ? (
              <View style={styles.galleryPrice}>
                <Icon name="coin" size={14} color="#FFD700" />
                <Text style={styles.galleryPriceText}>{item.price}</Text>
              </View>
            ) : (
              <Text style={styles.galleryFreeText}>Gratis</Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar un servicio
  const renderService = ({ item }) => {
    return (
      <TouchableOpacity style={styles.serviceCard} onPress={() => openService(item)}>
        <LinearGradient colors={[colors.variante1, colors.variante7]} style={styles.serviceIconContainer}>
          <Icon name={item.icon} size={24} color="#fff" />
        </LinearGradient>
        <Text style={styles.serviceName}>{item.name}</Text>
        <View style={styles.servicePrice}>
          <Icon name="coin" size={14} color="#FFD700" />
          <Text style={styles.servicePriceText}>{item.price}/min</Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizar un show próximo
  const renderUpcomingShow = ({ item }) => {
    return (
      <TouchableOpacity style={styles.showCard}>
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
          <Text style={styles.showDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.showFooter}>
            {item.price > 0 ? (
              <View style={styles.showPrice}>
                <Icon name="coin" size={14} color="#FFD700" />
                <Text style={styles.showPriceText}>{item.price}</Text>
              </View>
            ) : (
              <Text style={styles.showFreeText}>Gratis</Text>
            )}
            <TouchableOpacity style={styles.showReminderButton}>
              <Icon name="bell-plus" size={16} color="#fff" />
              <Text style={styles.showReminderText}>Recordar</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar una reseña
  const renderReview = ({ item }) => {
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewUser}>
            <View style={styles.reviewUserAvatar}>
              <Icon name="account" size={20} color="rgba(255, 255, 255, 0.7)" />
            </View>
            <View>
              <Text style={[styles.reviewUserName, { color: item.userLevel === "vip" ? "#FFD700" : colors.luminous }]}>
                {item.userName}
                {item.userLevel === "vip" && " 👑"}
              </Text>
              <Text style={styles.reviewDate}>{item.date}</Text>
            </View>
          </View>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={star <= item.rating ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
                style={{ marginLeft: 2 }}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewComment}>{item.comment}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header animado */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]}>
          <ImageBackground source={modelData.coverImage} style={styles.coverImage}>
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.coverGradient} />
          </ImageBackground>
        </Animated.View>

        <View style={styles.headerContent}>
          <View style={styles.headerTopBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>

            <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
              {modelData.name}
            </Animated.Text>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerActionButton} onPress={shareProfile}>
                <Icon name="share-variant" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerActionButton}>
                <Icon name="dots-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View style={[styles.profileInfo, { opacity: headerOpacity }]}>
            <View style={styles.profileImageContainer}>
              <Image source={modelData.image} style={styles.profileImage} />
              {modelData.isOnline && <View style={styles.onlineIndicator} />}
            </View>

            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{modelData.name}</Text>
              <View style={styles.profileStats}>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>{modelData.followers.toLocaleString()}</Text>
                  <Text style={styles.profileStatLabel}>Seguidores</Text>
                </View>
                <View style={styles.profileStat}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.profileStatValue}>{modelData.rating}</Text>
                    <Icon name="star" size={16} color="#FFD700" />
                  </View>
                  <Text style={styles.profileStatLabel}>{modelData.reviews} reseñas</Text>
                </View>
                <View style={styles.profileStat}>
                  <Text style={styles.profileStatValue}>${modelData.pricePerMinute}</Text>
                  <Text style={styles.profileStatLabel}>Por minuto</Text>
                </View>
              </View>

              <View style={styles.profileActions}>
                <TouchableOpacity
                  style={[styles.followButton, isFollowing && styles.followingButton]}
                  onPress={toggleFollow}
                >
                  <Icon name={isFollowing ? "account-check" : "account-plus"} size={20} color="#fff" />
                  <Text style={styles.followButtonText}>{isFollowing ? "Siguiendo" : "Seguir"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => navigation.navigate("PrivateChat", { modelId: modelData.id })}
                >
                  <Icon name="chat" size={20} color="#fff" />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>

                {modelData.isStreaming && (
                  <TouchableOpacity
                    style={styles.streamButton}
                    onPress={() => navigation.navigate("StreamingScreen", { modelId: modelData.id })}
                  >
                    <Icon name="broadcast" size={20} color="#fff" />
                    <Text style={styles.streamButtonText}>En vivo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Sobre mí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "galleries" && styles.activeTab]}
            onPress={() => setActiveTab("galleries")}
          >
            <Text style={[styles.tabText, activeTab === "galleries" && styles.activeTabText]}>Galerías</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "services" && styles.activeTab]}
            onPress={() => setActiveTab("services")}
          >
            <Text style={[styles.tabText, activeTab === "services" && styles.activeTabText]}>Servicios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "shows" && styles.activeTab]}
            onPress={() => setActiveTab("shows")}
          >
            <Text style={[styles.tabText, activeTab === "shows" && styles.activeTabText]}>Shows</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text style={[styles.tabText, activeTab === "reviews" && styles.activeTabText]}>Reseñas</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Contenido principal */}
      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Sobre mí */}
        {activeTab === "about" && (
          <View style={styles.aboutContainer}>
            <View style={styles.bioSection}>
              <Text style={styles.sectionTitle}>Biografía</Text>
              <Text style={styles.bioText}>{modelData.bio}</Text>
            </View>

            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Intereses</Text>
              <View style={styles.tagsContainer}>
                {modelData.tags.map((tag, index) => (
                  <View key={index} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Información</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Icon name="map-marker" size={20} color={colors.principal} />
                  <Text style={styles.infoLabel}>Ubicación</Text>
                  <Text style={styles.infoValue}>{modelData.location}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="cake-variant" size={20} color={colors.principal} />
                  <Text style={styles.infoLabel}>Edad</Text>
                  <Text style={styles.infoValue}>{modelData.age} años</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="human-male-height" size={20} color={colors.principal} />
                  <Text style={styles.infoLabel}>Altura</Text>
                  <Text style={styles.infoValue}>{modelData.height}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="ruler" size={20} color={colors.principal} />
                  <Text style={styles.infoLabel}>Medidas</Text>
                  <Text style={styles.infoValue}>{modelData.measurements}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="hair-dryer" size={20} color={colors.principal} />
                  <Text style={styles.infoLabel}>Cabello</Text>
                  <Text style={styles.infoValue}>{modelData.hairColor}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Icon name="eye" size={20} color={colors.principal} />
                  <Text style={styles.infoLabel}>Ojos</Text>
                  <Text style={styles.infoValue}>{modelData.eyeColor}</Text>
                </View>
              </View>
            </View>

            <View style={styles.languagesSection}>
              <Text style={styles.sectionTitle}>Idiomas</Text>
              <View style={styles.languagesContainer}>
                {modelData.languages.map((language, index) => (
                  <View key={index} style={styles.languageBadge}>
                    <Text style={styles.languageText}>{language}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>Horario</Text>
              <View style={styles.scheduleContainer}>
                <Icon name="clock-outline" size={20} color={colors.principal} />
                <Text style={styles.scheduleText}>{modelData.schedule}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Galerías */}
        {activeTab === "galleries" && (
          <View style={styles.galleriesContainer}>
            <FlatList
              data={GALLERIES}
              renderItem={renderGallery}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.galleriesGrid}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Servicios */}
        {activeTab === "services" && (
          <View style={styles.servicesContainer}>
            <FlatList
              data={modelData.services}
              renderItem={renderService}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.servicesGrid}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Shows */}
        {activeTab === "shows" && (
          <View style={styles.showsContainer}>
            <FlatList
              data={UPCOMING_SHOWS}
              renderItem={renderUpcomingShow}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.showsList}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Reseñas */}
        {activeTab === "reviews" && (
          <View style={styles.reviewsContainer}>
            <View style={styles.reviewsSummary}>
              <View style={styles.reviewsRating}>
                <Text style={styles.reviewsRatingValue}>{modelData.rating}</Text>
                <View style={styles.reviewsRatingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= Math.round(modelData.rating) ? "star" : "star-outline"}
                      size={20}
                      color="#FFD700"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
                <Text style={styles.reviewsCount}>Basado en {modelData.reviews} reseñas</Text>
              </View>
            </View>

            <FlatList
              data={REVIEWS}
              renderItem={renderReview}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.reviewsList}
              scrollEnabled={false}
            />

            <TouchableOpacity style={styles.writeReviewButton}>
              <LinearGradient
                colors={[colors.principal, colors.variante7]}
                style={styles.writeReviewButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="pencil" size={20} color="#fff" />
                <Text style={styles.writeReviewButtonText}>Escribir reseña</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </Animated.ScrollView>

      {/* Modal de galería */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGalleryModal}
        onRequestClose={() => setShowGalleryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.galleryModalContent}>
            <View style={styles.galleryModalHeader}>
              <Text style={styles.galleryModalTitle}>{selectedGallery?.title}</Text>
              <TouchableOpacity onPress={() => setShowGalleryModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            {selectedGallery?.isLocked ? (
              <View style={styles.lockedGalleryContainer}>
                <Image source={selectedGallery?.coverImage} style={styles.lockedGalleryCover} />
                <View style={styles.lockedGalleryOverlay}>
                  <Icon name="lock" size={50} color="#fff" />
                  <Text style={styles.lockedGalleryText}>Contenido bloqueado</Text>
                  <Text style={styles.lockedGallerySubtext}>
                    Desbloquea esta galería para ver todas las {selectedGallery?.images.length} fotos
                  </Text>

                  <View style={styles.galleryPriceContainer}>
                    <Icon name="coin" size={24} color="#FFD700" />
                    <Text style={styles.galleryPriceValue}>{selectedGallery?.price}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.unlockButton,
                      userTokens < (selectedGallery?.price || 0) && styles.unlockButtonDisabled,
                    ]}
                    onPress={purchaseGallery}
                    disabled={userTokens < (selectedGallery?.price || 0)}
                  >
                    <LinearGradient
                      colors={[colors.principal, colors.variante7]}
                      style={styles.unlockButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Icon name="lock-open" size={20} color="#fff" />
                      <Text style={styles.unlockButtonText}>Desbloquear</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {userTokens < (selectedGallery?.price || 0) && (
                    <TouchableOpacity
                      style={styles.buyTokensButton}
                      onPress={() => {
                        setShowGalleryModal(false)
                        navigation.navigate("BuyTokens")
                      }}
                    >
                      <Text style={styles.buyTokensButtonText}>Comprar tokens</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : (
              <FlatList
                data={selectedGallery?.images}
                renderItem={({ item }) => <Image source={item} style={styles.galleryModalImage} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.galleryModalImagesList}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de servicio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showServiceModal}
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.serviceModalContent}>
            <View style={styles.serviceModalHeader}>
              <Text style={styles.serviceModalTitle}>{selectedService?.name}</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <View style={styles.serviceModalBody}>
              <LinearGradient colors={[colors.variante1, colors.variante7]} style={styles.serviceModalIconContainer}>
                <Icon name={selectedService?.icon} size={40} color="#fff" />
              </LinearGradient>

              <Text style={styles.serviceModalDescription}>
                {selectedService?.name === "Chat privado"
                  ? "Inicia un chat privado con la modelo. Podrás enviar mensajes, fotos y recibir contenido exclusivo."
                  : selectedService?.name === "Videollamada"
                    ? "Realiza una videollamada en vivo con la modelo. Disfruta de una experiencia personalizada y exclusiva."
                    : selectedService?.name === "Fotos personalizadas"
                      ? "Solicita fotos personalizadas según tus preferencias. La modelo las creará especialmente para ti."
                      : "Disfruta de shows temáticos exclusivos con la modelo. Una experiencia única y personalizada."}
              </Text>

              <View style={styles.serviceModalPriceContainer}>
                <Text style={styles.serviceModalPriceLabel}>Precio:</Text>
                <View style={styles.serviceModalPrice}>
                  <Icon name="coin" size={24} color="#FFD700" />
                  <Text style={styles.serviceModalPriceValue}>{selectedService?.price}/min</Text>
                </View>
              </View>

              <View style={styles.serviceModalTokensInfo}>
                <Text style={styles.serviceModalTokensLabel}>Tus tokens:</Text>
                <View style={styles.serviceModalTokensValue}>
                  <Icon name="coin" size={16} color="#FFD700" />
                  <Text style={styles.serviceModalTokensText}>{userTokens}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.requestServiceButton,
                  userTokens < (selectedService?.price || 0) && styles.requestServiceButtonDisabled,
                ]}
                onPress={requestService}
                disabled={userTokens < (selectedService?.price || 0)}
              >
                <LinearGradient
                  colors={[colors.principal, colors.variante7]}
                  style={styles.requestServiceButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.requestServiceButtonText}>Solicitar servicio</Text>
                </LinearGradient>
              </TouchableOpacity>

              {userTokens < (selectedService?.price || 0) && (
                <TouchableOpacity
                  style={styles.buyTokensButton}
                  onPress={() => {
                    setShowServiceModal(false)
                    navigation.navigate("BuyTokens")
                  }}
                >
                  <Text style={styles.buyTokensButtonText}>Comprar tokens</Text>
                </TouchableOpacity>
              )}
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.fondoOscuro,
    zIndex: 1,
    overflow: "hidden",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  profileInfo: {
    flexDirection: "row",
    padding: 15,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.principal,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.exito,
    borderWidth: 2,
    borderColor: colors.fondoOscuro,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileStats: {
    flexDirection: "row",
    marginBottom: 15,
  },
  profileStat: {
    marginRight: 20,
  },
  profileStatValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileStatLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  profileActions: {
    flexDirection: "row",
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.principal,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  followingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  chatButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  streamButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  streamButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  tabsContainer: {
    backgroundColor: colors.fondoOscuro,
    marginTop: HEADER_MAX_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tabs: {
    paddingHorizontal: 15,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.principal,
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  activeTabText: {
    color: colors.principal,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginTop: 50, // Altura de los tabs
  },
  // Estilos para la pestaña "Sobre mí"
  aboutContainer: {
    padding: 15,
  },
  bioSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  bioText: {
    color: colors.variante3,
    lineHeight: 22,
  },
  tagsSection: {
    marginBottom: 25,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.variante3,
    fontSize: 12,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  infoLabel: {
    color: colors.variante3,
    fontSize: 12,
    marginTop: 5,
  },
  infoValue: {
    color: colors.luminous,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  languagesSection: {
    marginBottom: 25,
  },
  languagesContainer: {
    flexDirection: "row",
  },
  languageBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  languageText: {
    color: colors.variante3,
    fontSize: 14,
  },
  scheduleSection: {
    marginBottom: 25,
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
  },
  scheduleText: {
    color: colors.luminous,
    marginLeft: 10,
  },
  // Estilos para la pestaña "Galerías"
  galleriesContainer: {
    padding: 15,
  },
  galleriesGrid: {
    paddingBottom: 15,
  },
  galleryCard: {
    width: (width - 40) / 2,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    margin: 5,
  },
  galleryCover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  galleryLockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  galleryTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  galleryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  galleryImagesCount: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  galleryPrice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  galleryPriceText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 3,
  },
  galleryFreeText: {
    color: colors.exito,
    fontSize: 12,
    fontWeight: "bold",
  },
  // Estilos para la pestaña "Servicios"
  servicesContainer: {
    padding: 15,
  },
  servicesGrid: {
    paddingBottom: 15,
  },
  serviceCard: {
    width: (width - 40) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    margin: 5,
    alignItems: "center",
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceName: {
    color: colors.luminous,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  servicePrice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  servicePriceText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  // Estilos para la pestaña "Shows"
  showsContainer: {
    padding: 15,
  },
  showsList: {
    paddingBottom: 15,
  },
  showCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  showGradient: {
    padding: 15,
  },
  showHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  showType: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  showTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  showDate: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 10,
  },
  showDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 15,
  },
  showFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  showPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  showPriceText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  showFreeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  showReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  showReminderText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  // Estilos para la pestaña "Reseñas"
  reviewsContainer: {
    padding: 15,
  },
  reviewsSummary: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  reviewsRating: {
    alignItems: "center",
  },
  reviewsRatingValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  reviewsRatingStars: {
    flexDirection: "row",
    marginVertical: 10,
  },
  reviewsCount: {
    color: colors.variante3,
    fontSize: 14,
  },
  reviewsList: {
    paddingBottom: 15,
  },
  reviewCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  reviewUserName: {
    color: colors.luminous,
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewDate: {
    color: colors.variante3,
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewComment: {
    color: colors.variante3,
    lineHeight: 20,
  },
  writeReviewButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  writeReviewButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  writeReviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Estilos para modales
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilos para modal de galería
  galleryModalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    overflow: "hidden",
  },
  galleryModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  galleryModalTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
  },
  lockedGalleryContainer: {
    alignItems: "center",
  },
  lockedGalleryCover: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  lockedGalleryOverlay: {
    padding: 20,
    alignItems: "center",
  },
  lockedGalleryText: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  lockedGallerySubtext: {
    color: colors.variante3,
    textAlign: "center",
    marginBottom: 20,
  },
  galleryPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  galleryPriceValue: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  unlockButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  unlockButtonDisabled: {
    opacity: 0.5,
  },
  unlockButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  unlockButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  buyTokensButton: {
    paddingVertical: 10,
  },
  buyTokensButtonText: {
    color: colors.principal,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  galleryModalImagesList: {
    padding: 10,
  },
  galleryModalImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 10,
    borderRadius: 10,
  },
  // Estilos para modal de servicio
  serviceModalContent: {
    width: "90%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    overflow: "hidden",
  },
  serviceModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  serviceModalTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceModalBody: {
    padding: 20,
    alignItems: "center",
  },
  serviceModalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  serviceModalDescription: {
    color: colors.variante3,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  serviceModalPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  serviceModalPriceLabel: {
    color: colors.variante3,
    fontSize: 16,
  },
  serviceModalPrice: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceModalPriceValue: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  serviceModalTokensInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    borderRadius: 10,
  },
  serviceModalTokensLabel: {
    color: colors.variante3,
  },
  serviceModalTokensValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceModalTokensText: {
    color: "#FFD700",
    marginLeft: 5,
    fontWeight: "bold",
  },
  requestServiceButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  requestServiceButtonDisabled: {
    opacity: 0.5,
  },
  requestServiceButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  requestServiceButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSpace: {
    height: 80,
  },
})

export default ModelProfileScreen
