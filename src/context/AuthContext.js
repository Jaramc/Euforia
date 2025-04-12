import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

// Primero define el contexto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Actualiza el estado de carga cuando se completa la verificación
        });
        return () => unsubscribe();
    }, []);

    // Proporciona un valor para el contexto que incluye el usuario, setUser y loading
    const value = {
        user,
        setUser,
        loading
    };

    // Opcionalmente, puedes mostrar un indicador de carga mientras se verifica la autenticación
    if (loading) {
        return null; // O un componente de carga como <LoadingSpinner />
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Define el hook después de crear el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};