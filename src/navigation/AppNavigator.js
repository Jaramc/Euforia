import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../screens/UserScreen';
import MilistScreen from '../screens/MilistScreen';
import MyAccountScreen from '../screens/MyAccountScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Definición de MainTabNavigator dentro del mismo archivo
const MainTabNavigator = () => {
    return (
        <Tab.Navigator 
            initialRouteName="💕Chats💕"
            screenOptions={({route}) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === '💕Chats💕') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Cerca de ti😶‍🌫️') {
                        iconName = 'person-outline';
                    } else if (route.name === 'Mas destacado⭐') {
                        iconName = 'list-outline';
                    } else if (route.name === 'Mi cuenta') {
                        iconName = 'person-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#e18aff',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle:{backgroundColor: '#F8FAFC'}
            })}>
            <Tab.Screen name="💕Chats💕" component={HomeScreen} options={{}}/>
            <Tab.Screen name="Cerca de ti😶‍🌫️" component={UserScreen} options={{}}/>
            <Tab.Screen name="Mas destacado⭐" component={MilistScreen} options={{}} />
            <Tab.Screen name="Mi cuenta" component={MyAccountScreen} options={{}} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;