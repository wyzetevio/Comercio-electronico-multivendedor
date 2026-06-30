package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.dto.CarritoDTO;
import com.pochitastore.marketplace.entity.*;
import com.pochitastore.marketplace.mapper.CarritoMapper;
import com.pochitastore.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    // =========================
    // CRUD BÁSICO (DTO)
    // =========================

    public List<CarritoDTO> listar() {

        return carritoRepository.findAll()
                .stream()
                .map(CarritoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CarritoDTO obtener(Long id) {

        Carrito carrito = carritoRepository.findById(id)
                .orElse(null);

        return CarritoMapper.toDTO(carrito);
    }

    public CarritoDTO guardar(Carrito carrito) {

        carrito.setCreatedAt(LocalDateTime.now());
        carrito.setUpdatedAt(LocalDateTime.now());

        Carrito saved = carritoRepository.save(carrito);

        return CarritoMapper.toDTO(saved);
    }

    public CarritoDTO actualizar(Long id, Carrito carritoActualizado) {

        Carrito carrito = carritoRepository.findById(id)
                .orElse(null);

        if (carrito == null) {
            return null;
        }

        carrito.setEstado(carritoActualizado.getEstado());
        carrito.setUpdatedAt(LocalDateTime.now());

        Carrito updated = carritoRepository.save(carrito);

        return CarritoMapper.toDTO(updated);
    }

    public void eliminar(Long id) {
        carritoRepository.deleteById(id);
    }

    // =========================
    // LÓGICA REAL
    // =========================

    public Carrito obtenerCarritoEntity(Long usuarioId) {

        return carritoRepository
                .findByUsuarioIdUsuario(usuarioId)
                .orElse(null);
    }

    public CarritoDTO obtenerCarritoUsuario(Long usuarioId) {

        Carrito carrito = carritoRepository
                .findByUsuarioIdUsuario(usuarioId)
                .orElse(null);

        return CarritoMapper.toDTO(carrito);
    }

    public CarritoDTO agregarProducto(Long usuarioId,
                                      Long productoId,
                                      Integer cantidad) {

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        Producto producto = productoRepository.findById(productoId).orElse(null);

        if (usuario == null || producto == null) {
            return null;
        }

        Carrito carrito = carritoRepository
                .findByUsuarioIdUsuario(usuarioId)
                .orElseGet(() -> {

                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    nuevo.setEstado("ACTIVO");
                    nuevo.setCreatedAt(LocalDateTime.now());
                    nuevo.setUpdatedAt(LocalDateTime.now());

                    return carritoRepository.save(nuevo);
                });

        CarritoItem itemExistente =
                carritoItemRepository.findByCarritoIdCarritoAndProductoIdProducto(
                        carrito.getIdCarrito(),
                        productoId
                ).orElse(null);

        if (itemExistente != null) {

            itemExistente.setCantidad(itemExistente.getCantidad() + cantidad);
            carritoItemRepository.save(itemExistente);

        } else {

            CarritoItem item = new CarritoItem();
            item.setCarrito(carrito);
            item.setProducto(producto);
            item.setCantidad(cantidad);
            item.setPrecioUnitario(producto.getPrecio());

            carritoItemRepository.save(item);
        }

        // 🔥 recargar carrito actualizado
        Carrito updated = carritoRepository
                .findByUsuarioIdUsuario(usuarioId)
                .orElse(null);

        return CarritoMapper.toDTO(updated);
    }

    public void eliminarProducto(Long carritoItemId) {
        carritoItemRepository.deleteById(carritoItemId);
    }

    public void vaciarCarrito(Long carritoId) {

        List<CarritoItem> items =
                carritoItemRepository.findByCarritoIdCarrito(carritoId);

        carritoItemRepository.deleteAll(items);
    }

    public void actualizarCantidad(Long carritoItemId,
                                   Integer cantidad) {

        CarritoItem item = carritoItemRepository.findById(carritoItemId).orElse(null);

        if (item == null) return;

        item.setCantidad(cantidad);

        carritoItemRepository.save(item);
    }

    public Double calcularTotal(Long carritoId) {

        List<CarritoItem> items =
                carritoItemRepository.findByCarritoIdCarrito(carritoId);

        double total = 0;

        for (CarritoItem item : items) {
            total += item.getCantidad() * item.getPrecioUnitario();
        }

        return Math.round(total * 100.0) / 100.0;
    }
}