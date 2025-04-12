import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import colors from '../constants/colors';
import { signOut } from 'firebase/auth';

const UserScreen = ({ navigation }) => {  // Corregido: destructuración de props
    const { user } = useAuth(); // Obtener el usuario autenticado desde el contexto

    const handleLogout = () => {
        signOut(auth)
            .then(() => navigation.replace('Login')) // Cambiado a replace para evitar volver a la pantalla de usuario al presionar atrás
            .catch((error) => {
                console.error('Error', 'No se pudo cerrar sesión');
            });
    }
    
    return (
        <LinearGradient colors={colors.gradienteAccion} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{user?.displayName || 'Usuario'}</Text>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.buttonText}>Configuración</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Logout')}
                >
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {  // Añadido: estilo para el título
        fontSize: 28,
        color: colors.luminous,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: colors.luminous,
        fontWeight: '600',
    },
});

export default UserScreen;