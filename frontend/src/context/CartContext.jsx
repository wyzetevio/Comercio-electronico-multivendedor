/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Crear el contexto del carrito
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); // Obtenemos el usuario autenticado (con su token y idUsuario)
    
    // Estado del carrito del backend (objeto Carrito completo con sus items)
    const [cart, setCart] = useState(null); 
    
    // Estado temporal local (para usuarios visitantes no logueados)
    const [localCartItems, setLocalCartItems] = useState(() => {
        const stored = localStorage.getItem('pochita_cart');
        return stored ? JSON.parse(stored) : [];
    });
    
    const [loading, setLoading] = useState(false);

    // Cargar el carrito del servidor (memorizado para evitar re-renders y advertencias del hook)
    const fetchCartFromServer = useCallback(async () => {
        if (!user || !user.idUsuario) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/carritos/usuario/${user.idUsuario}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error("Error al obtener el carrito del servidor:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 1. EFECTO: Sincronizar/Cargar carrito cuando cambia el estado de autenticación
    useEffect(() => {
        if (user && user.idUsuario) {
            // Se usa setTimeout para diferir la llamada asíncrona fuera del ciclo de renderizado síncrono del effect
            const timer = setTimeout(() => {
                fetchCartFromServer();
            }, 0);
            return () => clearTimeout(timer);
        } else {
            // Se usa setTimeout para evitar actualizar el estado de manera síncrona dentro del effect
            const timer = setTimeout(() => {
                setCart(null);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user, fetchCartFromServer]);

    // 2. EFECTO: Guardar en localStorage los cambios del carrito de invitados
    useEffect(() => {
        if (!user) {
            localStorage.setItem('pochita_cart', JSON.stringify(localCartItems));
        }
    }, [localCartItems, user]);

    // ==========================================
    // ACCIONES GENERALES DEL CARRITO (Agregar, Quitar, Actualizar)
    // ==========================================

    // Agregar producto al carrito
    const addToCart = async (producto, cantidad = 1) => {
        if (user && user.idUsuario) {
            // Lógica con Backend: POST /api/carritos/agregar?usuarioId=...&productoId=...&cantidad=...
            try {
                const response = await fetch(
                    `http://localhost:8080/api/carritos/agregar?usuarioId=${user.idUsuario}&productoId=${producto.idProducto}&cantidad=${cantidad}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    }
                );
                if (response.ok) {
                    await fetchCartFromServer(); // Recargar los datos actualizados
                }
            } catch (error) {
                console.error("Error al agregar producto en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado): Se almacena en memoria local
            setLocalCartItems((prevItems) => {
                const itemExistente = prevItems.find(item => item.producto.idProducto === producto.idProducto);
                if (itemExistente) {
                    return prevItems.map(item =>
                        item.producto.idProducto === producto.idProducto
                            ? { ...item, cantidad: item.cantidad + cantidad }
                            : item
                    );
                }
                return [...prevItems, { producto, cantidad, precioUnitario: producto.precio }];
            });
        }
    };

    // Actualizar cantidad de un artículo
    const updateQuantity = async (id, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            removeItem(id);
            return;
        }

        if (user && user.idUsuario) {
            // Lógica con Backend: PUT /api/carritos/item/{carritoItemId}?cantidad=...
            // En el servidor el ID es el del 'carritoItem'
            try {
                const response = await fetch(
                    `http://localhost:8080/api/carritos/item/${id}?cantidad=${nuevaCantidad}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    }
                );
                if (response.ok) {
                    await fetchCartFromServer();
                }
            } catch (error) {
                console.error("Error al actualizar cantidad en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado)
            setLocalCartItems((prevItems) =>
                prevItems.map(item =>
                    item.producto.idProducto === id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );
        }
    };

    // Eliminar artículo del carrito
    const removeItem = async (id) => {
        if (user && user.idUsuario) {
            // Lógica con Backend: DELETE /api/carritos/item/{carritoItemId}
            try {
                const response = await fetch(`http://localhost:8080/api/carritos/item/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    await fetchCartFromServer();
                }
            } catch (error) {
                console.error("Error al eliminar item en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado)
            setLocalCartItems((prevItems) =>
                prevItems.filter(item => item.producto.idProducto !== id)
            );
        }
    };

    // Vaciar por completo el carrito
    const clearCart = async () => {
        if (user && user.idUsuario && cart) {
            // Lógica con Backend: DELETE /api/carritos/{carritoId}/vaciar
            try {
                const response = await fetch(`http://localhost:8080/api/carritos/${cart.idCarrito}/vaciar`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    setCart({ ...cart, items: [] });
                }
            } catch (error) {
                console.error("Error al vaciar el carrito en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado)
            setLocalCartItems([]);
        }
    };

    // Helper: Contar total de artículos agregados
    const getCartCount = () => {
        const itemsList = user ? (cart?.items || []) : localCartItems;
        return itemsList.reduce((acc, item) => acc + item.cantidad, 0);
    };

    // Helper: Obtener el total acumulado en dinero
    const getCartTotal = () => {
        const itemsList = user ? (cart?.items || []) : localCartItems;
        return itemsList.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    };

    return (
        <CartContext.Provider value={{
            items: user ? (cart?.items || []) : localCartItems,
            loading,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            getCartCount,
            getCartTotal,
            fetchCartFromServer
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para consumir el carrito desde cualquier componente
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};
