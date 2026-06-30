package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.dto.CarritoDTO;
import com.pochitastore.marketplace.entity.Carrito;
import com.pochitastore.marketplace.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carritos")
@RequiredArgsConstructor
public class CarritoController {

    private final CarritoService carritoService;

    // =========================
    // CRUD BÁSICO (DTO LAYER)
    // =========================

    @GetMapping
    public List<CarritoDTO> listar() {
        return carritoService.listar();
    }

    @GetMapping("/{id}")
    public CarritoDTO obtener(@PathVariable Long id) {
        return carritoService.obtener(id);
    }

    @PostMapping
    public CarritoDTO guardar(@RequestBody Carrito carrito) {
        return carritoService.guardar(carrito);
    }

    @PutMapping("/{id}")
    public CarritoDTO actualizar(@PathVariable Long id,
                                 @RequestBody Carrito carrito) {

        return carritoService.actualizar(id, carrito);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        carritoService.eliminar(id);
    }

    // =========================
    // ENDPOINTS REALES
    // =========================

    @GetMapping("/usuario/{usuarioId}")
    public CarritoDTO obtenerCarritoUsuario(@PathVariable Long usuarioId) {
        return carritoService.obtenerCarritoUsuario(usuarioId);
    }

    @PostMapping("/agregar")
    public CarritoDTO agregarProducto(
            @RequestParam Long usuarioId,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad) {

        return carritoService.agregarProducto(usuarioId, productoId, cantidad);
    }

    @DeleteMapping("/item/{carritoItemId}")
    public void eliminarProducto(@PathVariable Long carritoItemId) {
        carritoService.eliminarProducto(carritoItemId);
    }

    @DeleteMapping("/{carritoId}/vaciar")
    public void vaciarCarrito(@PathVariable Long carritoId) {
        carritoService.vaciarCarrito(carritoId);
    }

    @PutMapping("/item/{carritoItemId}")
    public void actualizarCantidad(
            @PathVariable Long carritoItemId,
            @RequestParam Integer cantidad) {

        carritoService.actualizarCantidad(carritoItemId, cantidad);
    }

    @GetMapping("/{carritoId}/total")
    public Double calcularTotal(@PathVariable Long carritoId) {
        return carritoService.calcularTotal(carritoId);
    }
}