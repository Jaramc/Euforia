import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    Modal,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import colors from '../constants/colors';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Estado para el modal de preferencias
    const [modalVisible, setModalVisible] = useState(false);
    
    // Lista de todas las preferencias disponibles
    const availablePreferences = [
        { id: 'citas', label: 'Citas' },
        { id: 'amistad', label: 'Amistad' },
        { id: 'relacion', label: 'Relación seria' },
        { id: 'casual', label: 'Encuentros casuales' },
        { id: 'bondage', label: 'Bondage' },
        { id: 'culonas', label: 'Culonas' },
        { id: 'tetona', label: 'Tetonas' },
        { id: 'bdsm', label: 'BDSM' },
        { id: 'fetiches', label: 'Fetiches' },
        { id: 'juguetes', label: 'Juguetes' },
    ];
    
    // Estado para las preferencias seleccionadas
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    
    // Función para manejar la selección de preferencias
    const togglePreference = (preference) => {
        if (selectedPreferences.includes(preference.id)) {
            setSelectedPreferences(selectedPreferences.filter(id => id !== preference.id));
        } else {
            setSelectedPreferences([...selectedPreferences, preference.id]);
        }
    };
    
    // Obtener texto para mostrar las preferencias seleccionadas
    const getSelectedPreferencesText = () => {
        if (selectedPreferences.length === 0) {
            return "Selecciona tus intereses";
        }
        
        const selectedLabels = availablePreferences
            .filter(pref => selectedPreferences.includes(pref.id))
            .map(pref => pref.label);
        
        if (selectedLabels.length <= 2) {
            return selectedLabels.join(", ");
        }
        
        return `${selectedLabels.length} intereses seleccionados`;
    };

    const handleRegister = () => {
        // Validación básica
        if (!username || !email || !password || !confirmPassword || !address) {
            setError(true);
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }

        if (password !== confirmPassword) {
            setError(true);
            setErrorMessage('Las contraseñas no coinciden');
            return;
        }
        
        // Verificar que al menos una preferencia esté seleccionada
        if (selectedPreferences.length === 0) {
            setError(true);
            setErrorMessage('Selecciona al menos una preferencia');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Aquí podrías guardar las preferencias en Firestore o en otro lugar
                // Por ejemplo: firestore().collection('users').doc(user.uid).set({ preferences: selectedPreferences })
                
                updateProfile(user, {
                    displayName: username,
                }).then(() => {
                    console.log('Usuario creado con éxito:', user);
                    console.log('Preferencias seleccionadas:', selectedPreferences);
                    navigation.navigate('Login');
                }).catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                });
            })
            .catch((error) => {
                setError(true);
                setErrorMessage(error.message);
            });
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Image source={require('../../assets/corazon-icon.png')} style={styles.logo} />
                <Text style={styles.title}>Crea una cuenta</Text>

                <View style={styles.inputContainer}>
                    <Icon name="account-outline" size={24} color={colors.variante3} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de usuario"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={24} color={colors.variante3} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={24} color={colors.variante3} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={24} color={colors.variante3} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar Contraseña"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="home-outline" size={24} color={colors.variante3} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Dirección"
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>
                
                {/* Sección de preferencias */}
                <Text style={styles.preferencesTitle}>Preferencias e Intereses</Text>
                
                <TouchableOpacity 
                    style={styles.dropdownButton} 
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.dropdownButtonText}>
                        {getSelectedPreferencesText()}
                    </Text>
                    <Icon name="chevron-down" size={20} color={colors.variante3} />
                </TouchableOpacity>
                
                {/* Modal para seleccionar preferencias */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Selecciona tus intereses</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="close" size={24} color={colors.variante3} />
                                </TouchableOpacity>
                            </View>
                            
                            <ScrollView style={styles.modalScrollView}>
                                {availablePreferences.map((preference) => (
                                    <TouchableOpacity
                                        key={preference.id}
                                        style={styles.preferenceItem}
                                        onPress={() => togglePreference(preference)}
                                    >
                                        <Text style={styles.preferenceText}>{preference.label}</Text>
                                        <Icon 
                                            name={selectedPreferences.includes(preference.id) ? "checkbox-marked" : "checkbox-blank-outline"} 
                                            size={24} 
                                            color={selectedPreferences.includes(preference.id) ? colors.principal : colors.variante3} 
                                        />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            
                            <TouchableOpacity 
                                style={styles.modalButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
                {error && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Registrarse</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.variante1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: colors.luminous,
        fontWeight: '600',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.fondoClaro,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: colors.variante3,
        width: '100%',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: colors.thin,
    },
    preferencesTitle: {
        fontSize: 18,
        color: colors.luminous,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.fondoClaro,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: colors.variante3,
        width: '100%',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: colors.thin,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: colors.fondoClaro,
        borderRadius: 10,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.variante3,
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.default,
    },
    modalScrollView: {
        maxHeight: 300,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    preferenceText: {
        fontSize: 16,
        color: colors.default,
    },
    modalButton: {
        backgroundColor: colors.principal,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 15,
    },
    modalButtonText: {
        color: colors.luminous,
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: colors.exito,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
    },
    registerButtonText: {
        color: colors.luminous,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: colors.luminous,
        fontSize: 14,
    },
    loginLink: {
        color: colors.variante7,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorMessage: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default RegisterScreen;