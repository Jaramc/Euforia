"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width, height } = Dimensions.get("window")

// Datos de ejemplo para el streaming
const STREAM_DATA = {
  id: "stream1",
  modelId: "1",
  modelName: "Sofía Valentina",
  modelImage: require("../../assets/Imagen (1).jpg"),
  title: "Viernes de diversión 💕",
  viewers: 234,
  likes: 156,
  tokens: 1250,
  duration: "01:23:45",
  type: "public", // public, private, vip
  price: 0, // 0 para public, precio para private/vip
  tags: ["Latina", "Curvy", "Interactive"],
  description: "¡Hola a todos! Bienvenidos a mi stream de viernes. Vamos a divertirnos juntos 😘",
}

// Datos de ejemplo para los mensajes del chat
const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg1",
    userId: "user1",
    userName: "Carlos_M",
    message: "Hola hermosa, te ves increíble hoy 😍",
    timestamp: new Date(Date.now() - 300000),
    userLevel: "vip",
    tokens: 0,
  },
  {
    id: "msg2",
    userId: "user2",
    userName: "Roberto_S",
    message: "¡Qué bueno verte de nuevo!",
    timestamp: new Date(Date.now() - 240000),
    userLevel: "premium",
    tokens: 0,
  },
  {
    id: "msg3",
    userId: "user3",
    userName: "Miguel_A",
    message: "50 tokens para ti preciosa 💰",
    timestamp: new Date(Date.now() - 180000),
    userLevel: "regular",
    tokens: 50,
  },
  {
    id: "msg4",
    userId: "user4",
    userName: "Juan_P",
    message: "¿Puedes saludarme?",
    timestamp: new Date(Date.now() - 120000),
    userLevel: "regular",
    tokens: 0,
  },
  {
    id: "msg5",
    userId: "user5",
    userName: "Luis_R",
    message: "100 tokens para que bailes 💃",
    timestamp: new Date(Date.now() - 60000),
    userLevel: "premium",
    tokens: 100,
  },
]

// Datos de ejemplo para los top donantes
const TOP_TIPPERS = [
  { userId: "user5", userName: "Luis_R", tokens: 500, userLevel: "premium" },
  { userId: "user3", userName: "Miguel_A", tokens: 300, userLevel: "regular" },
  { userId: "user1", userName: "Carlos_M", tokens: 200, userLevel: "vip" },
]

const StreamingScreen = ({ route, navigation }) => {
  const { user } = useAuth()
  const [streamData, setStreamData] = useState(STREAM_DATA)
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES)
  const [message, setMessage] = useState("")
  const [userTokens, setUserTokens] = useState(5000) // Tokens del usuario
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState("50")
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [showTopTippers, setShowTopTippers] = useState(false)
  const chatRef = useRef(null)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Simular nuevos mensajes cada cierto tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        "Me encanta tu show 😍",
        "Eres la mejor modelo de la plataforma",
        "¿Puedes hacer un baile?",
        "20 tokens para ti 💰",
        "Saludos desde México",
        "¿Cuándo será tu próximo show?",
      ]
      const randomUsers = ["Alex_23", "David_M", "Fernando_L", "Gabriel_P", "Héctor_R"]
      const randomLevels = ["regular", "premium", "vip"]

      const newMessage = {
        id: `msg${Date.now()}`,
        userId: `user${Math.floor(Math.random() * 1000)}`,
        userName: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        userLevel: randomLevels[Math.floor(Math.random() * randomLevels.length)],
        tokens: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0,
      }

      setChatMessages((prev) => [...prev, newMessage])

      // Actualizar viewers y likes aleatoriamente
      if (Math.random() > 0.7) {
        setStreamData((prev) => ({
          ...prev,
          viewers: prev.viewers + Math.floor(Math.random() * 5),
          likes: prev.likes + Math.floor(Math.random() * 3),
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    if (chatRef.current && chatMessages.length > 0) {
      chatRef.current.scrollToEnd({ animated: true })
    }
  }, [chatMessages])

  // Efecto para ocultar/mostrar controles
  useEffect(() => {
    let timeout
    if (isFullscreen) {
      timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start()
      }, 3000)
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }

    return () => clearTimeout(timeout)
  }, [isFullscreen, fadeAnim])

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (message.trim() === "") return

    const newMessage = {
      id: `msg${Date.now()}`,
      userId: user?.uid || "currentUser",
      userName: user?.displayName || "Usuario",
      message: message.trim(),
      timestamp: new Date(),
      userLevel: "regular",
      tokens: 0,
    }

    setChatMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  // Función para enviar un tip
  const sendTip = () => {
    const amount = Number.parseInt(tipAmount)
    if (isNaN(amount) || amount <= 0 || amount > userTokens) return

    const newMessage = {
      id: `msg${Date.now()}`,
      userId: user?.uid || "currentUser",
      userName: user?.displayName || "Usuario",
      message: `${amount} tokens para ti 💰`,
      timestamp: new Date(),
      userLevel: "regular",
      tokens: amount,
    }

    setChatMessages((prev) => [...prev, newMessage])
    setUserTokens((prev) => prev - amount)
    setStreamData((prev) => ({
      ...prev,
      tokens: prev.tokens + amount,
    }))
    setShowTipModal(false)
    setTipAmount("50")
  }

  // Función para dar like
  const toggleLike = () => {
    if (!isLiked) {
      setStreamData((prev) => ({
        ...prev,
        likes: prev.likes + 1,
      }))
    } else {
      setStreamData((prev) => ({
        ...prev,
        likes: prev.likes - 1,
      }))
    }
    setIsLiked(!isLiked)
  }

  // Renderizar un mensaje de chat
  const renderChatMessage = ({ item }) => {
    const isTokenMessage = item.tokens > 0
    const userLevelColor =
      item.userLevel === "vip" ? "#FFD700" : item.userLevel === "premium" ? colors.principal : colors.variante3

    return (
      <View style={[styles.chatMessage, isTokenMessage && styles.tokenMessage]}>
        <Text style={[styles.chatUserName, { color: userLevelColor }]}>
          {item.userName}
          {item.userLevel === "vip" && " 👑"}
        </Text>
        <Text style={styles.chatMessageText}>{item.message}</Text>
      </View>
    )
  }

  // Renderizar un top tipper
  const renderTopTipper = ({ item, index }) => {
    return (
      <View style={styles.topTipperItem}>
        <Text style={styles.topTipperRank}>#{index + 1}</Text>
        <Text style={[styles.topTipperName, { color: item.userLevel === "vip" ? "#FFD700" : colors.luminous }]}>
          {item.userName}
          {item.userLevel === "vip" && " 👑"}
        </Text>
        <View style={styles.topTipperTokens}>
          <Icon name="coin" size={14} color="#FFD700" />
          <Text style={styles.topTipperTokensText}>{item.tokens}</Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={isFullscreen} />

      <View style={styles.videoContainer}>
        {/* Video placeholder */}
        <Image source={streamData.modelImage} style={styles.videoPlaceholder} />

        {/* Overlay para controles */}
        <TouchableOpacity style={styles.videoOverlay} activeOpacity={1} onPress={() => setIsFullscreen(!isFullscreen)}>
          {/* Controles superiores */}
          <Animated.View style={[styles.topControls, { opacity: fadeAnim }]}>
            <View style={styles.topLeftControls}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.streamInfo}>
                <Text style={styles.modelName}>{streamData.modelName}</Text>
                <Text style={styles.streamTitle}>{streamData.title}</Text>
              </View>
            </View>

            <View style={styles.topRightControls}>
              <TouchableOpacity style={styles.infoButton} onPress={() => setShowInfoModal(true)}>
                <Icon name="information" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreButton} onPress={() => setShowActionsModal(true)}>
                <Icon name="dots-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Controles inferiores */}
          <Animated.View style={[styles.bottomControls, { opacity: fadeAnim }]}>
            <View style={styles.streamStats}>
              <View style={styles.statItem}>
                <Icon name="eye" size={16} color="#fff" />
                <Text style={styles.statText}>{streamData.viewers}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="heart" size={16} color="#fff" />
                <Text style={styles.statText}>{streamData.likes}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="coin" size={16} color="#FFD700" />
                <Text style={styles.statText}>{streamData.tokens}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="clock-outline" size={16} color="#fff" />
                <Text style={styles.statText}>{streamData.duration}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, isLiked && styles.actionButtonActive]}
                onPress={toggleLike}
              >
                <Icon name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? colors.error : "#fff"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowTipModal(true)}>
                <Icon name="gift" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowTopTippers(!showTopTippers)}>
                <Icon name="trophy" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowChat(!showChat)}>
                <Icon name={showChat ? "chat" : "chat-off"} size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setIsFullscreen(!isFullscreen)}>
                <Icon name={isFullscreen ? "fullscreen-exit" : "fullscreen"} size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Chat y top tippers */}
      {!isFullscreen && (
        <View style={styles.bottomSection}>
          {showChat ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.chatContainer}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
              {showTopTippers ? (
                <View style={styles.topTippersContainer}>
                  <View style={styles.topTippersHeader}>
                    <Text style={styles.topTippersTitle}>Top Donantes</Text>
                    <TouchableOpacity onPress={() => setShowTopTippers(false)}>
                      <Icon name="close" size={20} color={colors.variante3} />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={TOP_TIPPERS}
                    renderItem={renderTopTipper}
                    keyExtractor={(item) => item.userId}
                    contentContainerStyle={styles.topTippersList}
                  />
                </View>
              ) : (
                <>
                  <FlatList
                    ref={chatRef}
                    data={chatMessages}
                    renderItem={renderChatMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatMessagesList}
                  />
                  <View style={styles.chatInputContainer}>
                    <TextInput
                      style={styles.chatInput}
                      placeholder="Escribe un mensaje..."
                      placeholderTextColor={colors.variante3}
                      value={message}
                      onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                      <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.chatDisabledContainer}>
              <Icon name="chat-off" size={40} color={colors.variante3} />
              <Text style={styles.chatDisabledText}>Chat oculto</Text>
              <TouchableOpacity style={styles.showChatButton} onPress={() => setShowChat(true)}>
                <Text style={styles.showChatButtonText}>Mostrar chat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Modal para enviar tip */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTipModal}
        onRequestClose={() => setShowTipModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enviar Tokens</Text>
              <TouchableOpacity onPress={() => setShowTipModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <View style={styles.tipAmountContainer}>
              <Text style={styles.tipAmountLabel}>Cantidad:</Text>
              <View style={styles.tipAmountInputContainer}>
                <Icon name="coin" size={24} color="#FFD700" />
                <TextInput
                  style={styles.tipAmountInput}
                  value={tipAmount}
                  onChangeText={setTipAmount}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.quickAmounts}>
              {[10, 50, 100, 500].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.quickAmountButton, tipAmount === amount.toString() && styles.quickAmountButtonActive]}
                  onPress={() => setTipAmount(amount.toString())}
                >
                  <Text
                    style={[styles.quickAmountText, tipAmount === amount.toString() && styles.quickAmountTextActive]}
                  >
                    {amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.userTokensInfo}>
              <Text style={styles.userTokensLabel}>Tus tokens:</Text>
              <View style={styles.userTokensValue}>
                <Icon name="coin" size={16} color="#FFD700" />
                <Text style={styles.userTokensText}>{userTokens}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.sendTipButton,
                (!tipAmount || Number.parseInt(tipAmount) <= 0 || Number.parseInt(tipAmount) > userTokens) &&
                  styles.sendTipButtonDisabled,
              ]}
              onPress={sendTip}
              disabled={!tipAmount || Number.parseInt(tipAmount) <= 0 || Number.parseInt(tipAmount) > userTokens}
            >
              <LinearGradient
                colors={[colors.principal, colors.variante7]}
                style={styles.sendTipButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.sendTipButtonText}>Enviar Tokens</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para acciones adicionales */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showActionsModal}
        onRequestClose={() => setShowActionsModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionsModal(false)}>
          <View style={styles.actionsModalContent}>
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionsModal(false)
                navigation.navigate("ModelProfile", { modelId: streamData.modelId })
              }}
            >
              <Icon name="account" size={24} color={colors.luminous} />
              <Text style={styles.actionMenuItemText}>Ver perfil de modelo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionsModal(false)
                navigation.navigate("PrivateChat", { modelId: streamData.modelId })
              }}
            >
              <Icon name="chat-processing" size={24} color={colors.luminous} />
              <Text style={styles.actionMenuItemText}>Chat privado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionsModal(false)
                // Lógica para seguir a la modelo
              }}
            >
              <Icon name="account-plus" size={24} color={colors.luminous} />
              <Text style={styles.actionMenuItemText}>Seguir modelo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionsModal(false)
                // Lógica para compartir
              }}
            >
              <Icon name="share-variant" size={24} color={colors.luminous} />
              <Text style={styles.actionMenuItemText}>Compartir stream</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => {
                setShowActionsModal(false)
                // Lógica para reportar
              }}
            >
              <Icon name="flag" size={24} color={colors.error} />
              <Text style={[styles.actionMenuItemText, { color: colors.error }]}>Reportar contenido</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal para información del stream */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showInfoModal}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowInfoModal(false)}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>Información del Stream</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.infoModalBody}>
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Modelo</Text>
                <View style={styles.modelInfoRow}>
                  <Image source={streamData.modelImage} style={styles.infoModelImage} />
                  <View style={styles.modelInfoDetails}>
                    <Text style={styles.infoModelName}>{streamData.modelName}</Text>
                    <TouchableOpacity style={styles.followButton}>
                      <Text style={styles.followButtonText}>Seguir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Detalles</Text>
                <Text style={styles.infoStreamTitle}>{streamData.title}</Text>
                <Text style={styles.infoStreamDescription}>{streamData.description}</Text>

                <View style={styles.infoTagsContainer}>
                  {streamData.tags.map((tag, index) => (
                    <View key={index} style={styles.infoTagBadge}>
                      <Text style={styles.infoTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Estadísticas</Text>
                <View style={styles.infoStatsGrid}>
                  <View style={styles.infoStatItem}>
                    <Icon name="eye" size={24} color={colors.principal} />
                    <Text style={styles.infoStatValue}>{streamData.viewers}</Text>
                    <Text style={styles.infoStatLabel}>Espectadores</Text>
                  </View>
                  <View style={styles.infoStatItem}>
                    <Icon name="heart" size={24} color={colors.error} />
                    <Text style={styles.infoStatValue}>{streamData.likes}</Text>
                    <Text style={styles.infoStatLabel}>Me gusta</Text>
                  </View>
                  <View style={styles.infoStatItem}>
                    <Icon name="coin" size={24} color="#FFD700" />
                    <Text style={styles.infoStatValue}>{streamData.tokens}</Text>
                    <Text style={styles.infoStatLabel}>Tokens</Text>
                  </View>
                  <View style={styles.infoStatItem}>
                    <Icon name="clock-outline" size={24} color={colors.variante7} />
                    <Text style={styles.infoStatValue}>{streamData.duration}</Text>
                    <Text style={styles.infoStatLabel}>Duración</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondoOscuro,
  },
  videoContainer: {
    width: "100%",
    height: (width * 9) / 16, // Aspect ratio 16:9
    backgroundColor: "#000",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  topLeftControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  streamInfo: {
    flex: 1,
  },
  modelName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  streamTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  topRightControls: {
    flexDirection: "row",
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    padding: 15,
  },
  streamStats: {
    flexDirection: "row",
    marginBottom: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  statText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonActive: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: colors.fondoOscuro,
  },
  chatContainer: {
    flex: 1,
  },
  chatMessagesList: {
    padding: 10,
  },
  chatMessage: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  tokenMessage: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  chatUserName: {
    color: colors.variante3,
    fontWeight: "bold",
    marginBottom: 4,
  },
  chatMessageText: {
    color: colors.luminous,
  },
  chatInputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  chatInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#fff",
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.principal,
    justifyContent: "center",
    alignItems: "center",
  },
  chatDisabledContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatDisabledText: {
    color: colors.variante3,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  showChatButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  showChatButtonText: {
    color: colors.principal,
    fontWeight: "bold",
  },
  topTippersContainer: {
    flex: 1,
    padding: 15,
  },
  topTippersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  topTippersTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
  },
  topTippersList: {
    paddingVertical: 10,
  },
  topTipperItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  topTipperRank: {
    color: colors.variante3,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    width: 30,
  },
  topTipperName: {
    color: colors.luminous,
    fontSize: 16,
    flex: 1,
  },
  topTipperTokens: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  topTipperTokensText: {
    color: "#FFD700",
    marginLeft: 5,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
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
    fontSize: 20,
    fontWeight: "bold",
  },
  tipAmountContainer: {
    marginBottom: 20,
  },
  tipAmountLabel: {
    color: colors.variante3,
    marginBottom: 10,
  },
  tipAmountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tipAmountInput: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  quickAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickAmountButton: {
    width: "22%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  quickAmountButtonActive: {
    backgroundColor: colors.principal,
  },
  quickAmountText: {
    color: colors.variante3,
    fontWeight: "bold",
  },
  quickAmountTextActive: {
    color: "#fff",
  },
  userTokensInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userTokensLabel: {
    color: colors.variante3,
  },
  userTokensValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTokensText: {
    color: "#FFD700",
    marginLeft: 5,
    fontWeight: "bold",
  },
  sendTipButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  sendTipButtonDisabled: {
    opacity: 0.5,
  },
  sendTipButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  sendTipButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionsModalContent: {
    width: "85%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    padding: 10,
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  actionMenuItemText: {
    color: colors.luminous,
    fontSize: 16,
    marginLeft: 15,
  },
  infoModalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    padding: 20,
  },
  infoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  infoModalTitle: {
    color: colors.luminous,
    fontSize: 20,
    fontWeight: "bold",
  },
  infoModalBody: {
    maxHeight: height * 0.6,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoSectionTitle: {
    color: colors.variante3,
    fontSize: 16,
    marginBottom: 15,
  },
  modelInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoModelImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  modelInfoDetails: {
    flex: 1,
  },
  infoModelName: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  followButton: {
    backgroundColor: colors.principal,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoStreamTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoStreamDescription: {
    color: colors.variante3,
    marginBottom: 15,
  },
  infoTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoTagBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  infoTagText: {
    color: colors.variante3,
    fontSize: 12,
  },
  infoStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoStatItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  infoStatValue: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  infoStatLabel: {
    color: colors.variante3,
    fontSize: 12,
  },
})

export default StreamingScreen
