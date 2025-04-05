import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home'); // Navigate to Login screen after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [navigation]);
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
            <Image source={require('../../assets/Splash.png')} style={styles.logo}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
    },
    loader: {
        marginTop: 20,
    },
});

export default SplashScreen;