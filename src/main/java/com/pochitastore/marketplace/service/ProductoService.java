package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.dto.ProductoDTO;
import com.pochitastore.marketplace.entity.Categoria;
import com.pochitastore.marketplace.entity.Producto;
import com.pochitastore.marketplace.entity.Tienda;
import com.pochitastore.marketplace.mapper.ProductoMapper;
import com.pochitastore.marketplace.repository.CategoriaRepository;
import com.pochitastore.marketplace.repository.ProductoRepository;
import com.pochitastore.marketplace.repository.TiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final TiendaRepository tiendaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoMapper productoMapper;

    // =========================
    // CREATE (ENTITY OK)
    // =========================
    public Producto crearProducto(Long idTienda, Long idCategoria, Producto producto) {

        Tienda tienda = tiendaRepository.findById(idTienda)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));

        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        if (producto.getStock() < 0)
            throw new RuntimeException("El stock no puede ser negativo");

        if (producto.getPrecio() <= 0)
            throw new RuntimeException("El precio debe ser mayor a 0");

        producto.setTienda(tienda);
        producto.setCategoria(categoria);
        producto.setEstado(true);
        producto.setCreatedAt(LocalDateTime.now());
        producto.setUpdatedAt(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    // =========================
    // UPDATE (ENTITY OK)
    // =========================
    public Producto actualizarProducto(Long idProducto, Producto datos) {

        Producto producto = obtenerProductoEntity(idProducto);

        producto.setNombre(datos.getNombre());
        producto.setDescripcion(datos.getDescripcion());
        producto.setPrecio(datos.getPrecio());
        producto.setStock(datos.getStock());
        producto.setUpdatedAt(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    // =========================
    // ACTIVAR / DESACTIVAR
    // =========================
    public Producto desactivarProducto(Long idProducto) {
        Producto producto = obtenerProductoEntity(idProducto);
        producto.setEstado(false);
        producto.setUpdatedAt(LocalDateTime.now());
        return productoRepository.save(producto);
    }

    public Producto activarProducto(Long idProducto) {
        Producto producto = obtenerProductoEntity(idProducto);
        producto.setEstado(true);
        producto.setUpdatedAt(LocalDateTime.now());
        return productoRepository.save(producto);
    }

    // =========================
    // GET BY ID (DTO)
    // =========================
    public ProductoDTO obtenerProducto(Long idProducto) {
        Producto producto = obtenerProductoEntity(idProducto);
        return productoMapper.toDTO(producto);
    }

    // =========================
    // LISTADOS (DTO)
    // =========================
    public List<ProductoDTO> obtenerProductosActivos() {
        return productoRepository.findByEstadoTrue()
                .stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    public List<ProductoDTO> obtenerProductosTienda(Long idTienda) {
        return productoRepository.findByTiendaIdTiendaAndEstadoTrue(idTienda)
                .stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    public List<ProductoDTO> obtenerProductosCategoria(Long idCategoria) {
        return productoRepository.findByCategoriaIdCategoriaAndEstadoTrue(idCategoria)
                .stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    public List<ProductoDTO> buscarProductos(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndEstadoTrue(nombre)
                .stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    public List<ProductoDTO> obtenerProductosPorNombreCategoria(String nombre) {
        return productoRepository.findByCategoriaNombreIgnoreCaseAndEstadoTrue(nombre)
                .stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    public List<ProductoDTO> filtrarPorPrecio(Double min, Double max) {
        return productoRepository.findByPrecioBetweenAndEstadoTrue(min, max)
                .stream()
                .map(productoMapper::toDTO)
                .toList();
    }

    // =========================
    // STOCK (ENTITY OK)
    // =========================
    public Producto actualizarStock(Long idProducto, Integer nuevoStock) {

        Producto producto = obtenerProductoEntity(idProducto);

        if (nuevoStock < 0)
            throw new RuntimeException("Stock inválido");

        producto.setStock(nuevoStock);
        producto.setUpdatedAt(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    public void reducirStock(Long idProducto, Integer cantidad) {

        Producto producto = obtenerProductoEntity(idProducto);

        if (producto.getStock() < cantidad)
            throw new RuntimeException("Stock insuficiente");

        producto.setStock(producto.getStock() - cantidad);
        producto.setUpdatedAt(LocalDateTime.now());

        productoRepository.save(producto);
    }

    public void eliminarProducto(Long idProducto) {
        obtenerProductoEntity(idProducto);
        productoRepository.deleteById(idProducto);
    }

    // =========================
    // INTERNAL (ENTITY ONLY)
    // =========================
    private Producto obtenerProductoEntity(Long idProducto) {
        return productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}