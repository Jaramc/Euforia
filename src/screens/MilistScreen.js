import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const MiListScreen = () => {
    return (
        <LinearGradient colors={colors.gradienteSecundario} style={styles.container}>
            <Text style={styles.text}>Mi Lista</Text>
            <View style={styles.listContainer}>
                <Text style={styles.emptyText}>No tienes elementos en tu lista</Text>
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
    text: {
        fontSize: 24,
        color: colors.luminous,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    listContainer: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.luminous,
        opacity: 0.7,
    }
});

export default MiListScreen;