import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  CusthomTheme  from '../constants/CusthomTheme';
import colors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';


const SplashScreen = () => {
    const navigation = useNavigation();


    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login'); // Navigate to Login screen after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [navigation]);
    return (

        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <Text style={styles.text}>Solo unos segundos... </Text>
            <Image source={require('../../assets/Splash.png')} style={styles.logo}/>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CusthomTheme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.luminous,
    },
    loader: {
        marginTop: 20,
    },
});

export default SplashScreen;