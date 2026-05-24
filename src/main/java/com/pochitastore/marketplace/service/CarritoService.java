package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Carrito;
import com.pochitastore.marketplace.entity.CarritoItem;
import com.pochitastore.marketplace.entity.Producto;
import com.pochitastore.marketplace.entity.Usuario;
import com.pochitastore.marketplace.repository.CarritoItemRepository;
import com.pochitastore.marketplace.repository.CarritoRepository;
import com.pochitastore.marketplace.repository.ProductoRepository;
import com.pochitastore.marketplace.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    // =========================
    // CRUD BÁSICO
    // =========================

    public List<Carrito> listar() {
        return carritoRepository.findAll();
    }

    public Carrito obtener(Long id) {
        return carritoRepository.findById(id).orElse(null);
    }

    public Carrito guardar(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    public Carrito actualizar(Long id, Carrito carritoActualizado) {

        Carrito carrito = carritoRepository.findById(id).orElse(null);

        if (carrito == null) {
            return null;
        }

        carrito.setEstado(carritoActualizado.getEstado());

        return carritoRepository.save(carrito);
    }

    public void eliminar(Long id) {
        carritoRepository.deleteById(id);
    }

    // =========================
    // LÓGICA REAL DE NEGOCIO
    // =========================

    public Carrito obtenerCarritoUsuario(Long usuarioId) {

        return carritoRepository.findByUsuarioIdUsuario(usuarioId)
                .orElse(null);
    }

    public Carrito agregarProducto(Long usuarioId,
                                   Long productoId,
                                   Integer cantidad) {

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElse(null);

        Producto producto = productoRepository.findById(productoId)
                .orElse(null);

        if (usuario == null || producto == null) {
            return null;
        }

        Carrito carrito = carritoRepository
                .findByUsuarioIdUsuario(usuarioId)
                .orElseGet(() -> {

                    Carrito nuevoCarrito = new Carrito();
                    nuevoCarrito.setUsuario(usuario);
                    nuevoCarrito.setEstado("ACTIVO");

                    return carritoRepository.save(nuevoCarrito);
                });

        CarritoItem itemExistente = carritoItemRepository
                .findByCarritoIdCarritoAndProductoIdProducto(
                        carrito.getIdCarrito(),
                        productoId
                )
                .orElse(null);

        if (itemExistente != null) {

            itemExistente.setCantidad(
                    itemExistente.getCantidad() + cantidad
            );

            carritoItemRepository.save(itemExistente);

        } else {

            CarritoItem item = new CarritoItem();

            item.setCarrito(carrito);
            item.setProducto(producto);
            item.setCantidad(cantidad);
            item.setPrecioUnitario(producto.getPrecio());

            carritoItemRepository.save(item);
        }

        return carrito;
    }

    public void eliminarProducto(Long carritoItemId) {

        carritoItemRepository.deleteById(carritoItemId);
    }

    public void vaciarCarrito(Long carritoId) {

        List<CarritoItem> items = carritoItemRepository
                .findByCarritoIdCarrito(carritoId);

        carritoItemRepository.deleteAll(items);
    }

    public CarritoItem actualizarCantidad(Long carritoItemId,
                                          Integer cantidad) {

        CarritoItem item = carritoItemRepository
                .findById(carritoItemId)
                .orElse(null);

        if (item == null) {
            return null;
        }

        item.setCantidad(cantidad);

        return carritoItemRepository.save(item);
    }

    public Double calcularTotal(Long carritoId) {

        List<CarritoItem> items = carritoItemRepository
                .findByCarritoIdCarrito(carritoId);

        double total = 0;

        for (CarritoItem item : items) {

            total += item.getCantidad()
                    * item.getPrecioUnitario();
        }

        return total;
    }
}