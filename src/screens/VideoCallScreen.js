"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  BackHandler,
  TextInput,
  FlatList,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

const { width, height } = Dimensions.get("window")

// Datos de ejemplo para la videollamada
const MODEL_DATA = {
  id: "1",
  name: "Sofía Valentina",
  image: require("../../assets/Imagen (1).jpg"),
  pricePerMinute: 30,
  rating: 4.9,
}

const VideoCallScreen = ({ route, navigation }) => {
  const { user } = useAuth()
  const [modelData, setModelData] = useState(MODEL_DATA)
  const [callStatus, setCallStatus] = useState("connecting") // connecting, ongoing, ended
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [userTokens, setUserTokens] = useState(5000)
  const [showEndCallModal, setShowEndCallModal] = useState(false)
  const [showLowTokensModal, setShowLowTokensModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [selectedGift, setSelectedGift] = useState(null)
  const timerRef = useRef(null)
  const controlsTimerRef = useRef(null)

  // Datos de ejemplo para los regalos
  const GIFTS = [
    { id: "gift1", name: "Rosa", icon: "flower", price: 50 },
    { id: "gift2", name: "Corazón", icon: "heart", price: 100 },
    { id: "gift3", name: "Diamante", icon: "diamond", price: 200 },
    { id: "gift4", name: "Corona", icon: "crown", price: 300 },
    { id: "gift5", name: "Fuegos artificiales", icon: "firework", price: 500 },
  ]

  // Manejar el botón de retroceso de Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (callStatus === "ongoing") {
        setShowEndCallModal(true)
        return true
      }
      return false
    })

    return () => backHandler.remove()
  }, [callStatus])

  // Iniciar la llamada después de un tiempo
  useEffect(() => {
    if (callStatus === "connecting") {
      setTimeout(() => {
        setCallStatus("ongoing")
        startCallTimer()
      }, 3000)
    }
  }, [callStatus])

  // Ocultar controles después de un tiempo de inactividad
  useEffect(() => {
    if (showControls && callStatus === "ongoing") {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false)
      }, 5000)
    }

    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
  }, [showControls, callStatus])

  // Verificar tokens cada minuto
  useEffect(() => {
    if (callStatus === "ongoing") {
      const tokenCheckInterval = setInterval(() => {
        const costPerMinute = modelData.pricePerMinute
        if (userTokens < costPerMinute) {
          clearInterval(tokenCheckInterval)
          setShowLowTokensModal(true)
        }
      }, 60000)

      return () => clearInterval(tokenCheckInterval)
    }
  }, [callStatus, userTokens])

  // Iniciar el temporizador de la llamada
  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => {
        const newDuration = prev + 1
        // Cobrar tokens cada minuto
        if (newDuration % 60 === 0) {
          setUserTokens((prevTokens) => {
            const newTokens = prevTokens - modelData.pricePerMinute
            if (newTokens < modelData.pricePerMinute) {
              setShowLowTokensModal(true)
            }
            return newTokens
          })
        }
        return newDuration
      })
    }, 1000)
  }

  // Formatear la duración de la llamada
  const formatCallDuration = () => {
    const hours = Math.floor(callDuration / 3600)
    const minutes = Math.floor((callDuration % 3600) / 60)
    const seconds = callDuration % 60
    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  // Calcular el costo de la llamada
  const calculateCallCost = () => {
    const minutes = Math.ceil(callDuration / 60)
    return minutes * modelData.pricePerMinute
  }

  // Finalizar la llamada
  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCallStatus("ended")
    setShowRatingModal(true)
  }

  // Enviar calificación
  const submitRating = () => {
    // Aquí se enviaría la calificación al servidor
    setShowRatingModal(false)
    navigation.goBack()
  }

  // Enviar un regalo
  const sendGift = (gift) => {
    if (userTokens < gift.price) {
      Alert.alert(
        "Tokens insuficientes",
        "No tienes suficientes tokens para enviar este regalo. ¿Deseas comprar más tokens?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Comprar tokens",
            onPress: () => {
              setShowGiftModal(false)
              navigation.navigate("BuyTokens")
            },
          },
        ],
      )
      return
    }

    setUserTokens((prev) => prev - gift.price)
    setSelectedGift(gift)
    setShowGiftModal(false)

    // Mostrar animación del regalo (simulado)
    setTimeout(() => {
      setSelectedGift(null)
    }, 3000)
  }

  // Renderizar un regalo
  const renderGift = ({ item }) => {
    return (
      <TouchableOpacity style={styles.giftItem} onPress={() => sendGift(item)}>
        <View style={styles.giftIconContainer}>
          <Icon name={item.icon} size={30} color="#fff" />
        </View>
        <Text style={styles.giftName}>{item.name}</Text>
        <View style={styles.giftPrice}>
          <Icon name="coin" size={14} color="#FFD700" />
          <Text style={styles.giftPriceText}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Pantalla de la videollamada */}
      <View style={styles.callScreen}>
        {/* Video del modelo (simulado con imagen) */}
        <Image source={modelData.image} style={styles.modelVideo} />

        {/* Overlay para controles */}
        <TouchableOpacity
          style={styles.controlsOverlay}
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}
        >
          {/* Indicador de estado de la llamada */}
          {callStatus === "connecting" && (
            <View style={styles.connectingContainer}>
              <ActivityIndicator size="large" color={colors.principal} />
              <Text style={styles.connectingText}>Conectando con {modelData.name}...</Text>
            </View>
          )}

          {/* Video del usuario (simulado) */}
          {callStatus !== "ended" && (
            <View style={[styles.userVideoContainer, isCameraOff && styles.userVideoOff]}>
              {isCameraOff ? (
                <View style={styles.cameraOffIndicator}>
                  <Icon name="camera-off" size={24} color="#fff" />
                </View>
              ) : (
                <Image source={require("../../assets/Imagen (4).jpg")} style={styles.userVideo} />
              )}
            </View>
          )}

          {/* Controles superiores */}
          {showControls && (
            <View style={styles.topControls}>
              <View style={styles.callInfo}>
                <Text style={styles.modelName}>{modelData.name}</Text>
                <View style={styles.callDuration}>
                  <Icon name="clock-outline" size={16} color="#fff" />
                  <Text style={styles.callDurationText}>{formatCallDuration()}</Text>
                </View>
              </View>

              <View style={styles.callCost}>
                <Icon name="coin" size={16} color="#FFD700" />
                <Text style={styles.callCostText}>{calculateCallCost()}</Text>
              </View>
            </View>
          )}

          {/* Controles inferiores */}
          {showControls && (
            <View style={styles.bottomControls}>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={[styles.controlButton, isMuted && styles.controlButtonActive]}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  <Icon name={isMuted ? "microphone-off" : "microphone"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
                  onPress={() => setIsCameraOff(!isCameraOff)}
                >
                  <Icon name={isCameraOff ? "camera-off" : "camera"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
                  onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  <Icon name={isSpeakerOn ? "volume-high" : "volume-off"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, isPrivateMode && styles.controlButtonActive]}
                  onPress={() => setIsPrivateMode(!isPrivateMode)}
                >
                  <Icon name={isPrivateMode ? "eye-off" : "eye"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={() => setShowGiftModal(true)}>
                  <Icon name="gift" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.endCallButton} onPress={() => setShowEndCallModal(true)}>
                <Icon name="phone-hangup" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Animación de regalo (si se seleccionó uno) */}
          {selectedGift && (
            <View style={styles.giftAnimation}>
              <View style={styles.giftAnimationIcon}>
                <Icon name={selectedGift.icon} size={60} color="#fff" />
              </View>
              <Text style={styles.giftAnimationText}>{selectedGift.name}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal para confirmar finalizar llamada */}
      <Modal animationType="fade" transparent={true} visible={showEndCallModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Finalizar videollamada?</Text>
            <Text style={styles.modalText}>
              La llamada ha durado {formatCallDuration()} y ha costado {calculateCallCost()} tokens.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowEndCallModal(false)}>
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalConfirmButton} onPress={endCall}>
                <LinearGradient
                  colors={[colors.error, "#FF6B6B"]}
                  style={styles.modalConfirmButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalConfirmButtonText}>Finalizar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para tokens insuficientes */}
      <Modal animationType="fade" transparent={true} visible={showLowTokensModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tokens insuficientes</Text>
            <Text style={styles.modalText}>
              No tienes suficientes tokens para continuar la videollamada. La llamada finalizará en breve.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => {
                  setShowLowTokensModal(false)
                  endCall()
                }}
              >
                <LinearGradient
                  colors={[colors.principal, colors.variante7]}
                  style={styles.modalConfirmButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalConfirmButtonText}>Finalizar llamada</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBuyButton}
                onPress={() => {
                  setShowLowTokensModal(false)
                  navigation.navigate("BuyTokens")
                }}
              >
                <Text style={styles.modalBuyButtonText}>Comprar tokens</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para calificar la llamada */}
      <Modal animationType="slide" transparent={true} visible={showRatingModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModalContent}>
            <Text style={styles.ratingModalTitle}>Califica tu experiencia</Text>
            <Text style={styles.ratingModalSubtitle}>¿Cómo fue tu videollamada con {modelData.name}?</Text>

            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon
                    name={star <= rating ? "star" : "star-outline"}
                    size={40}
                    color={star <= rating ? "#FFD700" : "rgba(255, 255, 255, 0.5)"}
                    style={styles.ratingStar}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.ratingFeedback}>
              <Text style={styles.ratingFeedbackLabel}>Comentarios (opcional):</Text>
              <TextInput
                style={styles.ratingFeedbackInput}
                placeholder="Comparte tu experiencia..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                value={feedback}
                onChangeText={setFeedback}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitRatingButton, rating === 0 && styles.submitRatingButtonDisabled]}
              onPress={submitRating}
              disabled={rating === 0}
            >
              <LinearGradient
                colors={[colors.principal, colors.variante7]}
                style={styles.submitRatingButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitRatingButtonText}>Enviar calificación</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipRatingButton} onPress={() => navigation.goBack()}>
              <Text style={styles.skipRatingButtonText}>Omitir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para enviar regalos */}
      <Modal animationType="slide" transparent={true} visible={showGiftModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.giftModalContent}>
            <View style={styles.giftModalHeader}>
              <Text style={styles.giftModalTitle}>Enviar un regalo</Text>
              <TouchableOpacity onPress={() => setShowGiftModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <Text style={styles.giftModalSubtitle}>Sorprende a {modelData.name} con un regalo especial</Text>

            <View style={styles.userTokensInfo}>
              <Text style={styles.userTokensLabel}>Tus tokens:</Text>
              <View style={styles.userTokensValue}>
                <Icon name="coin" size={16} color="#FFD700" />
                <Text style={styles.userTokensText}>{userTokens}</Text>
              </View>
            </View>

            <FlatList
              data={GIFTS}
              renderItem={renderGift}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.giftsList}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  callScreen: {
    flex: 1,
    position: "relative",
  },
  modelVideo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  connectingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  connectingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
  },
  userVideoContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.principal,
  },
  userVideoOff: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  userVideo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cameraOffIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  callInfo: {
    flex: 1,
  },
  modelName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  callDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  callDurationText: {
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 5,
  },
  callCost: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  callCostText: {
    color: "#FFD700",
    marginLeft: 5,
    fontWeight: "bold",
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  controlButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  controlButtonActive: {
    backgroundColor: colors.principal,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  giftAnimation: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  giftAnimationIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  giftAnimationText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: colors.fondoOscuro,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    color: colors.variante3,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#fff",
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  modalConfirmButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  modalConfirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBuyButton: {
    marginTop: 15,
    paddingVertical: 12,
    width: "100%",
  },
  modalBuyButtonText: {
    color: colors.principal,
    textAlign: "center",
    fontWeight: "bold",
  },
  ratingModalContent: {
    width: width * 0.9,
    backgroundColor: colors.fondoOscuro,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  ratingModalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingModalSubtitle: {
    color: colors.variante3,
    textAlign: "center",
    marginBottom: 20,
  },
  ratingStars: {
    flexDirection: "row",
    marginBottom: 20,
  },
  ratingStar: {
    marginHorizontal: 5,
  },
  ratingFeedback: {
    width: "100%",
    marginBottom: 20,
  },
  ratingFeedbackLabel: {
    color: "#fff",
    marginBottom: 10,
  },
  ratingFeedbackInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    color: "#fff",
    height: 100,
    textAlignVertical: "top",
  },
  submitRatingButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 15,
  },
  submitRatingButtonDisabled: {
    opacity: 0.5,
  },
  submitRatingButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  submitRatingButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  skipRatingButton: {
    paddingVertical: 10,
  },
  skipRatingButtonText: {
    color: colors.variante3,
  },
  giftModalContent: {
    width: width * 0.9,
    backgroundColor: colors.fondoOscuro,
    borderRadius: 15,
    padding: 20,
  },
  giftModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  giftModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  giftModalSubtitle: {
    color: colors.variante3,
    marginBottom: 20,
  },
  userTokensInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  userTokensLabel: {
    color: "#fff",
  },
  userTokensValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTokensText: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 5,
  },
  giftsList: {
    paddingBottom: 10,
  },
  giftItem: {
    width: 100,
    alignItems: "center",
    marginRight: 15,
  },
  giftIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  giftName: {
    color: "#fff",
    marginBottom: 5,
  },
  giftPrice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  giftPriceText: {
    color: "#FFD700",
    fontSize: 12,
    marginLeft: 3,
  },
})

export default VideoCallScreen
