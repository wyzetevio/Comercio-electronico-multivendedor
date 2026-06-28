/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Crear el contexto de la tienda del vendedor
export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const { user } = useAuth(); // Obtenemos el usuario autenticado
    const [tienda, setTienda] = useState(null); // Almacena el objeto Tienda completo
    const [loading, setLoading] = useState(false);

    // Cargar los datos de la tienda desde el servidor (memorizado para evitar re-renders y advertencias del hook)
    const fetchStoreFromServer = useCallback(async () => {
        if (!user || user.rol !== 'VENDEDOR') {
            setTienda(null);
            return;
        }

        setLoading(true);
        try {
            // Buscamos en el endpoint público/autenticado de tiendas
            const response = await fetch('http://localhost:8080/api/tiendas', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const tiendasList = await response.json();
                
                // Mapeo inteligente de tu backend: Filtramos para encontrar la tienda que 
                // pertenece al idUsuario del vendedor logueado
                const miTienda = tiendasList.find(
                    t => t.vendedor && 
                         t.vendedor.usuario && 
                         t.vendedor.usuario.idUsuario === Number(user.idUsuario)
                );

                if (miTienda) {
                    setTienda(miTienda);
                } else {
                    setTienda(null); // Aún no ha creado su tienda (debe ir a CrearTienda.jsx)
                }
            }
        } catch (error) {
            console.error("Error al cargar la tienda del vendedor:", error);
            setTienda(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Recargar la tienda si el usuario cambia o inicia sesión como VENDEDOR
    useEffect(() => {
        if (user && user.rol === 'VENDEDOR') {
            // Se usa setTimeout para diferir la llamada asíncrona fuera del ciclo de renderizado síncrono del effect
            const timer = setTimeout(() => {
                fetchStoreFromServer();
            }, 0);
            return () => clearTimeout(timer);
        } else {
            // Se usa setTimeout para evitar la llamada de estado síncrona dentro del effect
            const timer = setTimeout(() => {
                setTienda(null);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user, fetchStoreFromServer]);

    // Función para actualizar los datos de la tienda localmente después de una edición (PUT)
    const updateLocalStoreData = (nuevaTienda) => {
        setTienda(nuevaTienda);
    };

    return (
        <StoreContext.Provider value={{
            tienda,
            loading,
            refrescarTienda: fetchStoreFromServer,
            actualizarTiendaLocal: updateLocalStoreData
        }}>
            {children}
        </StoreContext.Provider>
    );
};

// Hook personalizado para consumir la tienda desde cualquier pantalla del Dashboard
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore debe ser usado dentro de un StoreProvider');
    }
    return context;
};
