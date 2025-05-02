"use client"

import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import colors from "../constants/colors"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const { width, height } = Dimensions.get("window")

const SplashScreen = () => {
  const navigation = useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const [loadingProgress, setLoadingProgress] = useState(0)
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Añadimos una sutil animación de rotación para el logo
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: -0.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0.05,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start()

    // Animación de pulsación continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Animación de progreso
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2800,
      useNativeDriver: false,
    }).start()

    // Actualizar el progreso visual
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 100)

    // Navegar a la pantalla de login después de 3 segundos
    const timer = setTimeout(() => {
      // Animación de salida
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace("Login")
      })
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [navigation, fadeAnim, scaleAnim, rotateAnim, pulseAnim, progressAnim])

  // Mapear el progreso a un texto
  const getLoadingText = () => {
    if (loadingProgress < 30) return "Iniciando..."
    if (loadingProgress < 60) return "Cargando perfil..."
    if (loadingProgress < 90) return "Casi listo..."
    return "¡Bienvenido!"
  }

  // Interpolación para la rotación del logo
  const spin = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-20deg", "20deg"],
  })

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Imagen de fondo con overlay para simular desenfoque */}
      <ImageBackground source={require("../../assets/imagen16.jpg")} style={styles.backgroundImage}>
        {/* Overlay oscuro para simular desenfoque */}
        <View style={styles.blurOverlay} />

        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(20,20,35,0.8)", "rgba(30,30,45,0.9)"]}
          style={styles.gradientOverlay}
        >
          {/* Contenido animado */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Logo nuevo con animación */}
            <View style={styles.logoContainer}>
              <Animated.View
                style={[
                  styles.logoCircle,
                  {
                    transform: [{ rotate: spin }, { scale: pulseAnim }],
                  },
                ]}
              >
                <Image source={require("../../assets/imagenlogo.jpg")} style={styles.logo} />
              </Animated.View>
              <LinearGradient
                colors={[colors.principal, colors.variante7]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoGlow}
              />
            </View>

            {/* Texto principal */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Solo unos segundos</Text>
              <Text style={styles.subtitle}>{getLoadingText()}</Text>
            </View>

            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{loadingProgress}%</Text>
            </View>

            {/* Indicador de actividad */}
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.principal} />
              <View style={styles.pulseCircle} />
            </View>

            {/* Iconos decorativos */}
            <View style={styles.iconsContainer}>
              <Icon name="heart" size={20} color={colors.principal} style={styles.icon1} />
              <Icon name="star" size={16} color={colors.variante7} style={styles.icon2} />
              <Icon name="fire" size={18} color={colors.error} style={styles.icon3} />
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // Overlay oscuro para simular desenfoque
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 30,
    alignItems: "center",
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  logoGlow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    opacity: 0.3,
    zIndex: -1,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.luminous,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.variante3,
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  progressBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.principal,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.variante3,
  },
  loaderContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  pulseCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.principal,
    opacity: 0.2,
  },
  iconsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  icon1: {
    position: "absolute",
    top: "20%",
    left: "10%",
  },
  icon2: {
    position: "absolute",
    top: "40%",
    right: "15%",
  },
  icon3: {
    position: "absolute",
    bottom: "25%",
    left: "20%",
  },
})

export default SplashScreen
