import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import colors from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false); // Cambiado a booleano
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Validación básica
    if (!email || !password) {
      setError(true);
      setErrorMessage('Por favor, completa todos los campos');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario Logeado:', userCredential.user);
        setError(false);
        setErrorMessage('');
        navigation.navigate('MainTabs'); // Navega a la pantalla principal después de iniciar sesión
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
        console.log('Error al iniciar sesión:', error.message);
      });
  }; // Eliminada la llave extra

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/corazon-icon.png')} style={styles.logo} />
      <Text style={styles.title}>¿Buscando algo emocionante?</Text>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color={colors.variante3} style={styles.icon} />
        <TextInput
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(false); // Limpiar error al escribir
          }}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color={colors.variante3} style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(false); // Limpiar error al escribir
          }}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {error && (
        <Text style={styles.errorMessage}>
          {errorMessage || 'Revisa tus credenciales e intenta nuevamente.'}
        </Text>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.variante1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  loginButton: {
    backgroundColor: colors.exito,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: colors.luminous,
    fontSize: 14,
  },
  registerLink: {
    color: colors.variante7,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;