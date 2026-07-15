package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.dto.ProductoDTO;
import com.pochitastore.marketplace.entity.Producto;
import com.pochitastore.marketplace.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    // =========================
    // CREATE (ENTITY → ok)
    // =========================
    @PostMapping
    public Producto crearProducto(
            @RequestParam Long idTienda,
            @RequestParam Long idCategoria,
            @RequestBody Producto producto
    ) {
        return productoService.crearProducto(idTienda, idCategoria, producto);
    }

    // =========================
    // UPDATE (ENTITY → ok)
    // =========================
    @PutMapping("/{idProducto}")
    public Producto actualizarProducto(
            @PathVariable Long idProducto,
            @RequestParam(required = false) Long idCategoria,
            @RequestBody Producto producto
    ) {
        return productoService.actualizarProducto(idProducto, producto, idCategoria);
    }

    // =========================
    // GET BY ID (DTO recomendado)
    // =========================
    @GetMapping("/{idProducto}")
    public ProductoDTO obtenerProducto(
            @PathVariable Long idProducto
    ) {
        return productoService.obtenerProducto(idProducto);
    }

    // =========================
    // LISTA PRINCIPAL (DTO)
    // =========================
    @GetMapping
    public List<ProductoDTO> obtenerProductosActivos() {
        return productoService.obtenerProductosActivos();
    }

    // =========================
    // FILTROS (DTO)
    // =========================
    @GetMapping("/tienda/{idTienda}")
    public List<ProductoDTO> obtenerProductosTienda(
            @PathVariable Long idTienda,
            @RequestParam(required = false, defaultValue = "false") boolean todos
    ) {
        if (todos) {
            return productoService.obtenerTodosProductosTienda(idTienda);
        }
        return productoService.obtenerProductosTienda(idTienda);
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<ProductoDTO> obtenerProductosCategoria(
            @PathVariable Long idCategoria
    ) {
        return productoService.obtenerProductosCategoria(idCategoria);
    }

    @GetMapping("/buscar")
    public List<ProductoDTO> buscarProductos(
            @RequestParam String nombre
    ) {
        return productoService.buscarProductos(nombre);
    }

    // =========================
    // STOCK (ENTITY → ok)
    // =========================
    @PutMapping("/{idProducto}/stock")
    public Producto actualizarStock(
            @PathVariable Long idProducto,
            @RequestParam Integer stock
    ) {
        return productoService.actualizarStock(idProducto, stock);
    }

    @PutMapping("/{idProducto}/desactivar")
    public Producto desactivarProducto(
            @PathVariable Long idProducto
    ) {
        return productoService.desactivarProducto(idProducto);
    }

    @PutMapping("/{idProducto}/activar")
    public Producto activarProducto(
            @PathVariable Long idProducto
    ) {
        return productoService.activarProducto(idProducto);
    }

    @DeleteMapping("/{idProducto}")
    public void eliminarProducto(@PathVariable Long idProducto) {
        productoService.eliminarProducto(idProducto);
    }

    // =========================
    // CATEGORIA POR NOMBRE (DTO)
    // =========================
    @GetMapping("/categoria/nombre/{nombre}")
    public List<ProductoDTO> obtenerProductosPorNombreCategoria(
            @PathVariable String nombre
    ) {
        return productoService.obtenerProductosPorNombreCategoria(nombre);
    }

    // =========================
    // PRECIO (DTO)
    // =========================
    @GetMapping("/precio")
    public List<ProductoDTO> filtrarPorPrecio(
            @RequestParam Double min,
            @RequestParam Double max
    ) {
        return productoService.filtrarPorPrecio(min, max);
    }
}