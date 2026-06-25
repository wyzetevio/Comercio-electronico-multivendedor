/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

// Crear el contexto de autenticación (interno de este archivo)
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Inicializamos el estado de forma síncrona al cargar la app.
    // Esto evita llamadas de setState dentro de useEffect y renders innecesarios.
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const nombres = localStorage.getItem('nombres');
        const rol = localStorage.getItem('rol');
        
        if (token && rol) {
            return { token, email, nombres, rol };
        }
        return null;
    });

    const [loading] = useState(false);

    // Función de Login: Recibe la respuesta exacta del AuthController
    const login = (authResponse) => {
        const { token, email, nombres, rol } = authResponse;

        // Guardamos en el localStorage para mantener sesión al recargar
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('nombres', nombres);
        localStorage.setItem('rol', rol);

        // Actualizamos el estado global
        setUser({ token, email, nombres, rol });

        return rol; // Retorna el rol para que el formulario sepa a qué ruta redirigir
    };

    // Función de Logout: Limpia todo el localStorage y el estado
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('nombres');
        localStorage.removeItem('rol');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook para simplificar el uso del contexto en otros componentes
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
