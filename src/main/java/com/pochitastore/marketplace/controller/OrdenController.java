package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Orden;
import com.pochitastore.marketplace.entity.Suborden;
import com.pochitastore.marketplace.service.OrdenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService ordenService;

    @PostMapping
    public Orden crearOrden(@RequestBody Orden orden) {

        return ordenService.crearOrden(orden);
    }

    @PostMapping("/checkout")
    public Orden crearOrdenDesdeCarrito(
            @RequestParam Long usuarioId,
            @RequestParam Long direccionId
    ) {

        return ordenService.crearOrdenDesdeCarrito(
                usuarioId,
                direccionId
        );
    }


    @GetMapping("/{idOrden}")
    public Orden obtenerOrden(
            @PathVariable Long idOrden
    ) {

        return ordenService.obtenerOrdenPorId(idOrden);
    }


    @GetMapping("/usuario/{idUsuario}")
    public List<Orden> obtenerOrdenesCliente(
            @PathVariable Long idUsuario
    ) {

        return ordenService
                .obtenerOrdenesDelCliente(idUsuario);
    }

    @GetMapping("/{idOrden}/subordenes")
    public List<Suborden> obtenerSubordenes(
            @PathVariable Long idOrden
    ) {

        return ordenService.obtenerSubordenes(idOrden);
    }

    @PutMapping("/{idOrden}/pagar")
    public Orden marcarComoPagada(
            @PathVariable Long idOrden
    ) {

        return ordenService.marcarComoPagada(idOrden);
    }

    @PutMapping("/{idOrden}/cancelar")
    public Orden cancelarOrden(
            @PathVariable Long idOrden
    ) {

        return ordenService.cancelarOrden(idOrden);
    }

    @PutMapping("/{idOrden}/completar")
    public Orden completarOrden(
            @PathVariable Long idOrden
    ) {

        return ordenService.completarOrden(idOrden);
    }

    @GetMapping("/tienda/{idTienda}/subordenes")
    public List<Suborden> obtenerSubordenesTienda(
            @PathVariable Long idTienda
    ) {
        return ordenService.obtenerSubordenesPorTienda(idTienda);
    }

    @PutMapping("/suborden/{idSuborden}/estado")
    public Suborden actualizarEstadoSuborden(
            @PathVariable Long idSuborden,
            @RequestParam String estado
    ) {
        return ordenService.actualizarEstadoSuborden(idSuborden, estado);
    }

    @GetMapping("/todas")
    public List<Orden> obtenerTodasLasOrdenesAdmin() {
        return ordenService.obtenerTodasLasOrdenes();
    }

    @GetMapping("/{idOrden}/detalles")
    public List<com.pochitastore.marketplace.entity.DetalleSuborden> obtenerDetallesDeOrden(
            @PathVariable Long idOrden
    ) {
        return ordenService.obtenerDetallesDeOrden(idOrden);
    }
}