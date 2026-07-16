/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    obtenerCarritoUsuario,
    agregarProductoAlCarrito,
    actualizarCantidadItem,
    eliminarItemCarrito,
    vaciarCarrito
} from "../services/carritoService";
import { validarCupon } from "../services/cuponService";

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

    // Estado del cupón aplicado localmente
    const [cuponAplicado, setCuponAplicado] = useState(null);

    // Cargar el carrito del servidor (memorizado para evitar re-renders y advertencias del hook)
    const fetchCartFromServer = useCallback(async () => {
        if (!user || !user.idUsuario) return;
        setLoading(true);
        try {
            const data = await obtenerCarritoUsuario(user.idUsuario);
            setCart(data);
        } catch (error) {
            console.error("Error al obtener el carrito del servidor:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 1. EFECTO: Sincronizar/Cargar carrito cuando cambia el estado de autenticación
    useEffect(() => {
        if (user && user.idUsuario) {
            const syncCart = async () => {
                setLoading(true);
                try {
                    // Leer items del carrito local
                    const stored = localStorage.getItem('pochita_cart');
                    const itemsToSync = stored ? JSON.parse(stored) : [];

                    if (itemsToSync.length > 0) {
                        // Guardar en el servidor cada item local
                        for (const item of itemsToSync) {
                            try {
                                await agregarProductoAlCarrito(
                                    user.idUsuario,
                                    item.producto.idProducto,
                                    item.cantidad
                                );
                            } catch (err) {
                                console.error(`Error al sincronizar producto ${item.producto.idProducto}:`, err);
                            }
                        }
                        // Limpiar localStorage y el estado local de invitado
                        localStorage.removeItem('pochita_cart');
                        setLocalCartItems([]);
                    }
                } catch (error) {
                    console.error("Error al sincronizar el carrito temporal:", error);
                } finally {
                    await fetchCartFromServer();
                    setLoading(false);
                }
            };

            const timer = setTimeout(() => {
                syncCart();
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
        // Validación de stock
        let cantidadActual = 0;
        if (user && user.idUsuario && cart) {
            const item = cart.items?.find(i => (i.producto?.idProducto || i.idProducto) === producto.idProducto);
            if (item) cantidadActual = item.cantidad;
        } else {
            const item = localCartItems.find(i => (i.producto?.idProducto || i.idProducto) === producto.idProducto);
            if (item) cantidadActual = item.cantidad;
        }

        if (cantidadActual + cantidad > producto.stock) {
            alert(`No hay stock suficiente. Solo quedan ${producto.stock} unidades disponibles.`);
            return; // Bloquea la acción
        }

        if (user && user.idUsuario) {

            try {
                await agregarProductoAlCarrito(
                    user.idUsuario,
                    producto.idProducto,
                    cantidad
                );
                await fetchCartFromServer();
            } catch (error) {
                console.error("Error al agregar producto en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado): Se almacena en memoria local
            setLocalCartItems((prevItems) => {
                const itemExistente = prevItems.find(item => (item.producto?.idProducto || item.idProducto) === producto.idProducto);
                if (itemExistente) {
                    return prevItems.map(item =>
                        (item.producto?.idProducto || item.idProducto) === producto.idProducto
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
            const itemEnCarrito = cart?.items?.find(i => i.idCarritoItem === id);
            const stockMaximo = itemEnCarrito?.producto?.stock ?? itemEnCarrito?.stock ?? 999;
            if (itemEnCarrito && nuevaCantidad > stockMaximo) {
                alert(`No hay stock suficiente. Solo quedan ${stockMaximo} unidades disponibles.`);
                return;
            }

            // En el servidor el ID es el del 'carritoItem'
            try {
                await actualizarCantidadItem(id, nuevaCantidad);
                await fetchCartFromServer();
            } catch (error) {
                console.error("Error al actualizar cantidad en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado)
            const itemEnCarrito = localCartItems.find(i => (i.producto?.idProducto || i.idProducto) === id);
            const stockMaximo = itemEnCarrito?.producto?.stock ?? itemEnCarrito?.stock ?? 999;
            if (itemEnCarrito && nuevaCantidad > stockMaximo) {
                alert(`No hay stock suficiente. Solo quedan ${stockMaximo} unidades disponibles.`);
                return;
            }

            setLocalCartItems((prevItems) =>
                prevItems.map(item =>
                    (item.producto?.idProducto || item.idProducto) === id
                        ? { ...item, cantidad: nuevaCantidad }
                        : item
                )
            );
        }
    };

    // Eliminar artículo del carrito
    const removeItem = async (id) => {
        if (user && user.idUsuario) {

            try {
                await eliminarItemCarrito(id);
                await fetchCartFromServer();
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

            try {
                await vaciarCarrito(cart.idCarrito);
                await fetchCartFromServer();;
            } catch (error) {
                console.error("Error al vaciar el carrito en el servidor:", error);
            }
        } else {
            // Lógica Local (Invitado)
            setLocalCartItems([]);
        }
        setCuponAplicado(null);
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
    // ==========================================
    // MANEJO DE CUPONES
    // ==========================================
    const aplicarCuponCodigo = async (codigo) => {
        try {
            const data = await validarCupon(codigo);
            if (data && data.activo) {
                setCuponAplicado(data);
                return { success: true, message: "¡Cupón aplicado con éxito!" };
            }
            return { success: false, message: "Cupón inactivo" };
        } catch (error) {
            console.error("Error validando cupón:", error);
            // El backend probablemente devuelve 404 o similar
            return { success: false, message: "Código de cupón inválido o expirado" };
        }
    };

    const removerCupon = () => {
        setCuponAplicado(null);
    };

    return (
        <CartContext.Provider value={{
            items: user ? (cart?.items || []) : localCartItems,
            loading,
            cuponAplicado,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            getCartCount,
            getCartTotal,
            fetchCartFromServer,
            aplicarCuponCodigo,
            removerCupon
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
