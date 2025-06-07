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
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width, height } = Dimensions.get("window")

// Datos de ejemplo para el modelo
const MODEL_DATA = {
  id: "1",
  name: "Sofía Valentina",
  image: require("../../assets/Imagen (1).jpg"),
  rating: 4.9,
  pricePerMinute: 15,
  isOnline: true,
  isTyping: false,
  lastSeen: "Hace 5 minutos",
}

// Datos de ejemplo para los mensajes
const INITIAL_MESSAGES = [
  {
    id: "msg1",
    senderId: "model1",
    text: "¡Hola! Gracias por contactarme. ¿Cómo estás hoy?",
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    type: "text",
  },
  {
    id: "msg2",
    senderId: "user1",
    text: "Hola Sofía, estoy bien gracias. Me gustó mucho tu último show.",
    timestamp: new Date(Date.now() - 3500000),
    read: true,
    type: "text",
  },
  {
    id: "msg3",
    senderId: "model1",
    text: "¡Me alegra que te haya gustado! Estoy preparando algo especial para el próximo viernes.",
    timestamp: new Date(Date.now() - 3400000),
    read: true,
    type: "text",
  },
  {
    id: "msg4",
    senderId: "model1",
    text: "¿Te gustaría ver una foto de mi nuevo outfit?",
    timestamp: new Date(Date.now() - 3300000),
    read: true,
    type: "text",
  },
  {
    id: "msg5",
    senderId: "user1",
    text: "¡Claro que sí! Me encantaría verlo.",
    timestamp: new Date(Date.now() - 3200000),
    read: true,
    type: "text",
  },
  {
    id: "msg6",
    senderId: "model1",
    image: require("../../assets/Imagen (5).jpg"),
    text: "Aquí tienes 😊 ¿Qué te parece?",
    timestamp: new Date(Date.now() - 3100000),
    read: true,
    type: "image",
    price: 50,
    isPaid: true,
  },
  {
    id: "msg7",
    senderId: "user1",
    text: "¡Wow! Te ves increíble. Definitivamente estaré en tu próximo show.",
    timestamp: new Date(Date.now() - 3000000),
    read: true,
    type: "text",
  },
  {
    id: "msg8",
    senderId: "model1",
    text: "¡Gracias! Tengo más fotos exclusivas si estás interesado.",
    timestamp: new Date(Date.now() - 2900000),
    read: true,
    type: "text",
  },
]

// Datos de ejemplo para los paquetes de mensajes
const MESSAGE_PACKAGES = [
  {
    id: "pkg1",
    name: "Básico",
    messages: 10,
    price: 100,
    discount: 0,
  },
  {
    id: "pkg2",
    name: "Premium",
    messages: 50,
    price: 450,
    discount: 10,
  },
  {
    id: "pkg3",
    name: "VIP",
    messages: 100,
    price: 800,
    discount: 20,
  },
]

const PrivateChatScreen = ({ route, navigation }) => {
  const { user } = useAuth()
  const [modelData, setModelData] = useState(MODEL_DATA)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState("")
  const [userTokens, setUserTokens] = useState(5000) // Tokens del usuario
  const [messagesLeft, setMessagesLeft] = useState(15) // Mensajes restantes
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef(null)

  // Simular que el modelo está escribiendo
  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setModelData((prev) => ({
          ...prev,
          isTyping: !prev.isTyping,
        }))
      }
    }, 5000)

    return () => clearInterval(typingInterval)
  }, [])

  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    if (chatRef.current && messages.length > 0) {
      chatRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (inputText.trim() === "") return
    if (messagesLeft <= 0) {
      setShowPackageModal(true)
      return
    }

    const newMessage = {
      id: `msg${Date.now()}`,
      senderId: user?.uid || "user1",
      text: inputText.trim(),
      timestamp: new Date(),
      read: false,
      type: "text",
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText("")
    setMessagesLeft((prev) => prev - 1)

    // Simular respuesta del modelo después de un tiempo aleatorio
    setTimeout(
      () => {
        setModelData((prev) => ({
          ...prev,
          isTyping: true,
        }))

        setTimeout(
          () => {
            const modelResponses = [
              "¡Gracias por tu mensaje! 😊",
              "Me encanta hablar contigo.",
              "¿Qué planes tienes para hoy?",
              "¿Te gustaría ver más contenido exclusivo?",
              "Cuéntame más sobre ti.",
              "Estaré haciendo un show especial este fin de semana, ¿te gustaría asistir?",
            ]

            const responseMessage = {
              id: `msg${Date.now()}`,
              senderId: "model1",
              text: modelResponses[Math.floor(Math.random() * modelResponses.length)],
              timestamp: new Date(),
              read: false,
              type: "text",
            }

            setMessages((prev) => [...prev, responseMessage])
            setModelData((prev) => ({
              ...prev,
              isTyping: false,
            }))
          },
          2000 + Math.random() * 2000,
        )
      },
      1000 + Math.random() * 2000,
    )
  }

  // Función para comprar un paquete de mensajes
  const purchasePackage = (pkg) => {
    if (userTokens < pkg.price) {
      // Mostrar mensaje de tokens insuficientes
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setUserTokens((prev) => prev - pkg.price)
      setMessagesLeft((prev) => prev + pkg.messages)
      setShowPackageModal(false)
      setIsLoading(false)
    }, 1500)
  }

  // Función para pagar por un mensaje con contenido premium
  const payForContent = () => {
    if (!selectedMessage) return
    if (userTokens < selectedMessage.price) {
      // Mostrar mensaje de tokens insuficientes
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setUserTokens((prev) => prev - selectedMessage.price)
      setMessages((prev) => prev.map((msg) => (msg.id === selectedMessage.id ? { ...msg, isPaid: true } : msg)))
      setShowPaymentModal(false)
      setIsLoading(false)
    }, 1500)
  }

  // Función para abrir una imagen
  const openImage = (message) => {
    if (message.type === "image") {
      if (!message.isPaid && message.price > 0) {
        setSelectedMessage(message)
        setShowPaymentModal(true)
      } else {
        setSelectedImage(message.image)
        setShowImageModal(true)
      }
    }
  }

  // Formatear la fecha del mensaje
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Renderizar un mensaje
  const renderMessage = ({ item }) => {
    const isUser = item.senderId === (user?.uid || "user1")
    const showAvatar =
      !isUser &&
      (!messages[messages.indexOf(item) - 1] || messages[messages.indexOf(item) - 1].senderId !== item.senderId)

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.modelMessageContainer]}>
        {showAvatar && <Image source={modelData.image} style={styles.messageAvatar} />}

        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.modelMessageBubble]}>
          {item.type === "image" ? (
            <TouchableOpacity onPress={() => openImage(item)} activeOpacity={0.9}>
              {item.isPaid || item.price === 0 ? (
                <Image source={item.image} style={styles.messageImage} />
              ) : (
                <View style={styles.lockedImageContainer}>
                  <Image source={item.image} style={styles.blurredImage} blurRadius={20} />
                  <View style={styles.lockOverlay}>
                    <Icon name="lock" size={30} color="#fff" />
                    <Text style={styles.lockedImageText}>Contenido bloqueado</Text>
                    <View style={styles.lockedImagePrice}>
                      <Icon name="coin" size={14} color="#FFD700" />
                      <Text style={styles.lockedImagePriceText}>{item.price}</Text>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ) : null}

          {item.text ? (
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.modelMessageText]}>
              {item.text}
            </Text>
          ) : null}

          <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.modelMessageTime]}>
            {formatMessageTime(item.timestamp)}
            {isUser &&
              (item.read ? (
                <Icon name="check-all" size={14} color={colors.exito} style={styles.readIcon} />
              ) : (
                <Icon name="check" size={14} color="rgba(255, 255, 255, 0.5)" style={styles.readIcon} />
              ))}
          </Text>
        </View>
      </View>
    )
  }

  // Renderizar un paquete de mensajes
  const renderPackage = ({ item }) => {
    const isAffordable = userTokens >= item.price

    return (
      <TouchableOpacity
        style={[styles.packageCard, !isAffordable && styles.packageCardDisabled]}
        onPress={() => isAffordable && purchasePackage(item)}
        disabled={!isAffordable || isLoading}
      >
        <LinearGradient
          colors={isAffordable ? [colors.principal, colors.variante7] : ["#555", "#333"]}
          style={styles.packageGradient}
        >
          <Text style={styles.packageName}>{item.name}</Text>
          <Text style={styles.packageMessages}>{item.messages} mensajes</Text>

          {item.discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}

          <View style={styles.packagePrice}>
            <Icon name="coin" size={18} color="#FFD700" />
            <Text style={styles.packagePriceText}>{item.price}</Text>
          </View>

          {!isAffordable && (
            <View style={styles.insufficientTokens}>
              <Icon name="alert-circle" size={14} color="#fff" />
              <Text style={styles.insufficientTokensText}>Tokens insuficientes</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
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

          <TouchableOpacity
            style={styles.modelInfo}
            onPress={() => navigation.navigate("ModelProfile", { modelId: modelData.id })}
          >
            <Image source={modelData.image} style={styles.modelImage} />
            <View style={styles.modelDetails}>
              <Text style={styles.modelName}>{modelData.name}</Text>
              <Text style={styles.modelStatus}>
                {modelData.isTyping ? "Escribiendo..." : modelData.isOnline ? "En línea" : modelData.lastSeen}
              </Text>
            </View>
            {modelData.isOnline && <View style={styles.onlineIndicator} />}
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => navigation.navigate("VideoCall", { modelId: modelData.id })}
            >
              <Icon name="video" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Icon name="dots-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.priceInfo}>
            <Icon name="coin" size={14} color="#FFD700" />
            <Text style={styles.priceText}>{modelData.pricePerMinute}/min</Text>
          </View>
          <View style={styles.messagesInfo}>
            <Icon name="message-text" size={14} color="#fff" />
            <Text style={styles.messagesText}>{messagesLeft} mensajes restantes</Text>
          </View>
          <TouchableOpacity style={styles.buyButton} onPress={() => setShowPackageModal(true)}>
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Chat */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={chatRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="paperclip" size={24} color={colors.variante3} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.variante3}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <LinearGradient colors={[colors.principal, colors.variante7]} style={styles.sendButtonGradient}>
              <Icon name="send" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modal para comprar paquetes de mensajes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPackageModal}
        onRequestClose={() => setShowPackageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comprar Mensajes</Text>
              <TouchableOpacity onPress={() => setShowPackageModal(false)} disabled={isLoading}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Compra paquetes de mensajes para seguir chateando con {modelData.name}.
            </Text>

            <View style={styles.userTokensInfo}>
              <Text style={styles.userTokensLabel}>Tus tokens:</Text>
              <View style={styles.userTokensValue}>
                <Icon name="coin" size={16} color="#FFD700" />
                <Text style={styles.userTokensText}>{userTokens}</Text>
              </View>
            </View>

            <FlatList
              data={MESSAGE_PACKAGES}
              renderItem={renderPackage}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.packagesList}
            />

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.principal} />
                <Text style={styles.loadingText}>Procesando compra...</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.buyTokensButton}
              onPress={() => {
                setShowPackageModal(false)
                navigation.navigate("BuyTokens")
              }}
              disabled={isLoading}
            >
              <Text style={styles.buyTokensButtonText}>Comprar más tokens</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para ver imagen */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.closeImageButton} onPress={() => setShowImageModal(false)}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={selectedImage} style={styles.fullImage} resizeMode="contain" />
        </View>
      </Modal>

      {/* Modal para pagar por contenido */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contenido Premium</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} disabled={isLoading}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <View style={styles.premiumContentPreview}>
              <Image source={selectedMessage?.image} style={styles.premiumContentImage} blurRadius={20} />
              <View style={styles.premiumContentOverlay}>
                <Icon name="lock" size={40} color="#fff" />
                <Text style={styles.premiumContentText}>Contenido bloqueado</Text>
              </View>
            </View>

            <Text style={styles.modalDescription}>
              Desbloquea este contenido exclusivo enviado por {modelData.name}.
            </Text>

            <View style={styles.contentPriceContainer}>
              <Text style={styles.contentPriceLabel}>Precio:</Text>
              <View style={styles.contentPrice}>
                <Icon name="coin" size={24} color="#FFD700" />
                <Text style={styles.contentPriceValue}>{selectedMessage?.price}</Text>
              </View>
            </View>

            <View style={styles.userTokensInfo}>
              <Text style={styles.userTokensLabel}>Tus tokens:</Text>
              <View style={styles.userTokensValue}>
                <Icon name="coin" size={16} color="#FFD700" />
                <Text style={styles.userTokensText}>{userTokens}</Text>
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.principal} />
                <Text style={styles.loadingText}>Procesando pago...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.unlockButton, userTokens < (selectedMessage?.price || 0) && styles.unlockButtonDisabled]}
                onPress={payForContent}
                disabled={userTokens < (selectedMessage?.price || 0) || isLoading}
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
            )}

            {userTokens < (selectedMessage?.price || 0) && (
              <TouchableOpacity
                style={styles.buyTokensButton}
                onPress={() => {
                  setShowPaymentModal(false)
                  navigation.navigate("BuyTokens")
                }}
              >
                <Text style={styles.buyTokensButtonText}>Comprar tokens</Text>
              </TouchableOpacity>
            )}
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
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  modelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  modelImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  modelDetails: {
    flex: 1,
  },
  modelName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modelStatus: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.exito,
    position: "absolute",
    bottom: 0,
    left: 30,
    borderWidth: 2,
    borderColor: colors.variante1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  chatInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  priceText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  messagesInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  messagesText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  buyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
  },
  modelMessageContainer: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    alignSelf: "flex-end",
  },
  messageBubble: {
    borderRadius: 18,
    padding: 10,
    maxWidth: "100%",
  },
  userMessageBubble: {
    backgroundColor: colors.principal,
    borderBottomRightRadius: 5,
  },
  modelMessageBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 5,
  },
  userMessageText: {
    color: "#fff",
  },
  modelMessageText: {
    color: colors.luminous,
  },
  messageTime: {
    fontSize: 10,
    alignSelf: "flex-end",
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  modelMessageTime: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  readIcon: {
    marginLeft: 3,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  lockedImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
    overflow: "hidden",
  },
  blurredImage: {
    width: "100%",
    height: "100%",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  lockedImageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
  },
  lockedImagePrice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  lockedImagePriceText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
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
  modalDescription: {
    color: colors.variante3,
    marginBottom: 20,
  },
  userTokensInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    borderRadius: 10,
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
  packagesList: {
    paddingBottom: 10,
  },
  packageCard: {
    width: 150,
    height: 150,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 10,
  },
  packageCardDisabled: {
    opacity: 0.7,
  },
  packageGradient: {
    width: "100%",
    height: "100%",
    padding: 15,
    justifyContent: "space-between",
  },
  packageName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  packageMessages: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  packagePrice: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  packagePriceText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  insufficientTokens: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  insufficientTokensText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  loadingText: {
    color: colors.variante3,
    marginTop: 10,
  },
  buyTokensButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buyTokensButtonText: {
    color: colors.principal,
    fontWeight: "bold",
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeImageButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fullImage: {
    width: width,
    height: height * 0.7,
  },
  premiumContentPreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  premiumContentImage: {
    width: "100%",
    height: "100%",
  },
  premiumContentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumContentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  contentPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  contentPriceLabel: {
    color: colors.variante3,
    fontSize: 16,
  },
  contentPrice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  contentPriceValue: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  unlockButton: {
    borderRadius: 10,
    overflow: "hidden",
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
    marginLeft: 10,
  },
})

export default PrivateChatScreen
