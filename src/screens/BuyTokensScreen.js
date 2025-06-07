"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import colors from "../constants/colors"

// Datos de ejemplo para los paquetes de tokens
const TOKEN_PACKAGES = [
  {
    id: "pkg1",
    name: "Paquete Básico",
    tokens: 100,
    price: 9.99,
    discount: 0,
    popular: false,
  },
  {
    id: "pkg2",
    name: "Paquete Estándar",
    tokens: 500,
    price: 39.99,
    discount: 20,
    popular: true,
  },
  {
    id: "pkg3",
    name: "Paquete Premium",
    tokens: 1000,
    price: 69.99,
    discount: 30,
    popular: false,
  },
  {
    id: "pkg4",
    name: "Paquete VIP",
    tokens: 2500,
    price: 149.99,
    discount: 40,
    popular: false,
  },
  {
    id: "pkg5",
    name: "Paquete Diamante",
    tokens: 5000,
    price: 249.99,
    discount: 50,
    popular: false,
  },
]

// Datos de ejemplo para los métodos de pago
const PAYMENT_METHODS = [
  {
    id: "method1",
    name: "Tarjeta de crédito/débito",
    icon: "credit-card",
  },
  {
    id: "method2",
    name: "PayPal",
    icon: "paypal",
  },
  {
    id: "method3",
    name: "Google Pay",
    icon: "google",
  },
  {
    id: "method4",
    name: "Apple Pay",
    icon: "apple",
  },
  {
    id: "method5",
    name: "Transferencia bancaria",
    icon: "bank",
  },
]

// Datos de ejemplo para el historial de transacciones
const TRANSACTION_HISTORY = [
  {
    id: "trans1",
    tokens: 500,
    price: 39.99,
    date: "15/05/2023",
    method: "Tarjeta de crédito",
    status: "completed",
  },
  {
    id: "trans2",
    tokens: 100,
    price: 9.99,
    date: "02/05/2023",
    method: "PayPal",
    status: "completed",
  },
  {
    id: "trans3",
    tokens: 1000,
    price: 69.99,
    date: "20/04/2023",
    method: "Google Pay",
    status: "completed",
  },
]

const BuyTokensScreen = ({ navigation }) => {
  const { user, userTokens, updateUserTokens } = useAuth() // Use context
  // const [userTokens, setUserTokens] = useState(5000) // Remove this line
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [purchasedTokens, setPurchasedTokens] = useState(0)

  // Función para comprar tokens
  const buyTokens = () => {
    if (!selectedPackage || !selectedPaymentMethod) return

    setIsLoading(true)
    setTimeout(() => {
      updateUserTokens(selectedPackage.tokens, "add") // Use context function
      setPurchasedTokens(selectedPackage.tokens)
      setIsLoading(false)
      setShowPaymentModal(false)
      setShowSuccessModal(true)
    }, 2000)
  }

  // Renderizar un paquete de tokens
  const renderTokenPackage = ({ item }) => {
    const isSelected = selectedPackage?.id === item.id
    const originalPrice = item.price / (1 - item.discount / 100)

    return (
      <TouchableOpacity
        style={[styles.packageCard, isSelected && styles.selectedPackageCard]}
        onPress={() => setSelectedPackage(item)}
      >
        <View style={styles.packageHeader}>
          <Text style={styles.packageName}>{item.name}</Text>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Más popular</Text>
            </View>
          )}
        </View>

        <View style={styles.tokensContainer}>
          <Icon name="coin" size={24} color="#FFD700" />
          <Text style={styles.tokensAmount}>{item.tokens}</Text>
          <Text style={styles.tokensLabel}>tokens</Text>
        </View>

        {item.discount > 0 && (
          <View style={styles.discountContainer}>
            <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <Text style={styles.priceAmount}>{item.price.toFixed(2)}</Text>
        </View>

        <LinearGradient
          colors={
            isSelected
              ? [colors.principal, colors.variante7]
              : ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]
          }
          style={styles.selectButton}
        >
          <Text style={[styles.selectButtonText, isSelected && styles.selectedButtonText]}>
            {isSelected ? "Seleccionado" : "Seleccionar"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Renderizar un método de pago
  const renderPaymentMethod = ({ item }) => {
    const isSelected = selectedPaymentMethod?.id === item.id

    return (
      <TouchableOpacity
        style={[styles.paymentMethodItem, isSelected && styles.selectedPaymentMethod]}
        onPress={() => setSelectedPaymentMethod(item)}
      >
        <Icon name={item.icon} size={24} color={isSelected ? colors.principal : colors.variante3} />
        <Text style={[styles.paymentMethodName, isSelected && styles.selectedPaymentMethodName]}>{item.name}</Text>
        {isSelected && <Icon name="check-circle" size={20} color={colors.principal} />}
      </TouchableOpacity>
    )
  }

  // Renderizar una transacción
  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionTokens}>
            <Icon name="coin" size={16} color="#FFD700" />
            <Text style={styles.transactionTokensText}>{item.tokens}</Text>
          </View>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionPrice}>${item.price}</Text>
          <Text style={styles.transactionMethod}>{item.method}</Text>
        </View>

        <View style={styles.transactionStatus}>
          <View
            style={[
              styles.statusIndicator,
              item.status === "completed" ? styles.completedStatus : styles.pendingStatus,
            ]}
          />
          <Text style={styles.statusText}>{item.status === "completed" ? "Completado" : "Pendiente"}</Text>
        </View>
      </View>
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
          <Text style={styles.headerTitle}>Comprar Tokens</Text>
          <TouchableOpacity style={styles.historyButton} onPress={() => setShowHistoryModal(true)}>
            <Icon name="history" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Tu balance actual</Text>
          <View style={styles.balanceAmount}>
            <Icon name="coin" size={24} color="#FFD700" />
            <Text style={styles.balanceText}>{userTokens}</Text>
            <Text style={styles.balanceTokens}>tokens</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona un paquete</Text>

        <FlatList
          data={TOKEN_PACKAGES}
          renderItem={renderTokenPackage}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.packagesList}
        />

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Icon name="shield-check" size={24} color={colors.principal} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Pago seguro</Text>
              <Text style={styles.infoDescription}>
                Todas las transacciones están protegidas con encriptación de nivel bancario.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon name="account-check" size={24} color={colors.principal} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Privacidad garantizada</Text>
              <Text style={styles.infoDescription}>
                Tu información personal y detalles de pago nunca se comparten con terceros.
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Icon name="help-circle" size={24} color={colors.principal} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Soporte 24/7</Text>
              <Text style={styles.infoDescription}>
                Nuestro equipo de soporte está disponible para ayudarte en cualquier momento.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !selectedPackage && styles.disabledButton]}
          onPress={() => selectedPackage && setShowPaymentModal(true)}
          disabled={!selectedPackage}
        >
          <LinearGradient
            colors={selectedPackage ? [colors.principal, colors.variante7] : ["#555", "#333"]}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de método de pago */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Método de pago</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} disabled={isLoading}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Selecciona un método de pago para comprar {selectedPackage?.tokens} tokens por $
              {selectedPackage?.price.toFixed(2)}.
            </Text>

            <FlatList
              data={PAYMENT_METHODS}
              renderItem={renderPaymentMethod}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.paymentMethodsList}
            />

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.principal} />
                <Text style={styles.loadingText}>Procesando pago...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.payButton, !selectedPaymentMethod && styles.disabledButton]}
                onPress={buyTokens}
                disabled={!selectedPaymentMethod || isLoading}
              >
                <LinearGradient
                  colors={selectedPaymentMethod ? [colors.principal, colors.variante7] : ["#555", "#333"]}
                  style={styles.payButtonGradient}
                >
                  <Text style={styles.payButtonText}>Pagar ${selectedPackage?.price.toFixed(2)}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Icon name="check-circle" size={60} color={colors.exito} />
            </View>

            <Text style={styles.successTitle}>¡Compra exitosa!</Text>
            <Text style={styles.successMessage}>
              Has comprado {purchasedTokens} tokens correctamente. ¡Disfrútalos!
            </Text>

            <View style={styles.newBalanceContainer}>
              <Text style={styles.newBalanceLabel}>Tu nuevo balance</Text>
              <View style={styles.newBalanceAmount}>
                <Icon name="coin" size={24} color="#FFD700" />
                <Text style={styles.newBalanceText}>{userTokens}</Text>
                <Text style={styles.newBalanceTokens}>tokens</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeSuccessButton} onPress={() => setShowSuccessModal(false)}>
              <LinearGradient colors={[colors.principal, colors.variante7]} style={styles.closeSuccessButtonGradient}>
                <Text style={styles.closeSuccessButtonText}>Continuar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de historial */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHistoryModal}
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.historyModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Historial de compras</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Icon name="close" size={24} color={colors.default} />
              </TouchableOpacity>
            </View>

            {TRANSACTION_HISTORY.length > 0 ? (
              <FlatList
                data={TRANSACTION_HISTORY}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.transactionsList}
              />
            ) : (
              <View style={styles.emptyHistoryContainer}>
                <Icon name="history" size={60} color={colors.variante3} />
                <Text style={styles.emptyHistoryText}>No tienes historial de compras todavía.</Text>
              </View>
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    alignItems: "center",
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  balanceAmount: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 5,
  },
  balanceTokens: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    color: colors.luminous,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  packagesList: {
    paddingBottom: 15,
  },
  packageCard: {
    width: 200,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
  },
  selectedPackageCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: colors.principal,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  packageName: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
  },
  popularBadge: {
    backgroundColor: colors.principal,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  tokensContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  tokensAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 5,
  },
  tokensLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  originalPrice: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  discountText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  currencySymbol: {
    color: "#fff",
    fontSize: 16,
    marginRight: 2,
  },
  priceAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  selectButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  selectButtonText: {
    color: colors.variante3,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitle: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  infoDescription: {
    color: colors.variante3,
    fontSize: 12,
    lineHeight: 16,
  },
  continueButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 18,
    fontWeight: "bold",
  },
  modalDescription: {
    color: colors.variante3,
    marginBottom: 20,
  },
  paymentMethodsList: {
    marginBottom: 20,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selectedPaymentMethod: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: colors.principal,
  },
  paymentMethodName: {
    color: colors.variante3,
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  selectedPaymentMethodName: {
    color: colors.luminous,
    fontWeight: "500",
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
  payButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  payButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successModalContent: {
    width: "90%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0, 180, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    color: colors.luminous,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  successMessage: {
    color: colors.variante3,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  newBalanceContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    width: "100%",
    marginBottom: 20,
  },
  newBalanceLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  newBalanceAmount: {
    flexDirection: "row",
    alignItems: "center",
  },
  newBalanceText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 5,
  },
  newBalanceTokens: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  closeSuccessButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  closeSuccessButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  closeSuccessButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyModalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.fondoOscuro,
    borderRadius: 20,
    padding: 20,
  },
  transactionsList: {
    paddingBottom: 10,
  },
  transactionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  transactionTokens: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  transactionTokensText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  transactionDate: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  transactionPrice: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionMethod: {
    color: colors.variante3,
    fontSize: 14,
  },
  transactionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  completedStatus: {
    backgroundColor: colors.exito,
  },
  pendingStatus: {
    backgroundColor: "#FFD700",
  },
  statusText: {
    color: colors.variante3,
    fontSize: 12,
  },
  emptyHistoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyHistoryText: {
    color: colors.variante3,
    textAlign: "center",
    marginTop: 15,
  },
})

export default BuyTokensScreen
