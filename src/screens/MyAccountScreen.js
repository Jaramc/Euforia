import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const MyAccountScreen = () => {
    return (
        <LinearGradient colors={colors.gradienteAccion} style={styles.container}>
            <Text style={styles.title}>Mi Cuenta</Text>
            
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color={colors.luminous} />
                </View>
                <Text style={styles.username}>Usuario</Text>
                <Text style={styles.email}>usuario@ejemplo.com</Text>
            </View>
            
            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="settings-outline" size={24} color={colors.luminous} />
                    <Text style={styles.optionText}>Configuración</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="notifications-outline" size={24} color={colors.luminous} />
                    <Text style={styles.optionText}>Notificaciones</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="help-circle-outline" size={24} color={colors.luminous} />
                    <Text style={styles.optionText}>Ayuda</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="log-out-outline" size={24} color={colors.luminous} />
                    <Text style={styles.optionText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        color: colors.luminous,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        marginBottom: 10,
    },
    username: {
        fontSize: 20,
        color: colors.luminous,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: colors.luminous,
        opacity: 0.8,
    },
    optionsContainer: {
        width: '90%',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    optionText: {
        fontSize: 16,
        color: colors.luminous,
        marginLeft: 15,
    }
});

export default MyAccountScreen;
