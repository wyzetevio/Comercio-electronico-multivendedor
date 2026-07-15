package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Cupon;
import com.pochitastore.marketplace.service.CuponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cupones")
@RequiredArgsConstructor
public class CuponController {

    private final CuponService cuponService;

    @GetMapping
    public List<Cupon> listarCupones() {
        return cuponService.listarCupones();
    }

    @GetMapping("/activos")
    public List<Cupon> obtenerCuponesActivos() {
        return cuponService.obtenerCuponesActivos();
    }

    @PostMapping
    public Cupon crearCupon(@RequestBody Cupon cupon) {
        return cuponService.crearCupon(cupon);
    }

    @PutMapping("/{id}/toggle")
    public Cupon alternarEstado(@PathVariable Long id) {
        return cuponService.alternarEstado(id);
    }

    @DeleteMapping("/{id}")
    public void eliminarCupon(@PathVariable Long id) {
        cuponService.eliminarCupon(id);
    }

    // Endpoint público para el carrito de compras
    @GetMapping("/validar/{codigo}")
    public Cupon validarCupon(@PathVariable String codigo) {
        return cuponService.validarCupon(codigo);
    }
}
