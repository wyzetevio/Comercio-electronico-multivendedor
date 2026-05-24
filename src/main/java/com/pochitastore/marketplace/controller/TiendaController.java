package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Tienda;
import com.pochitastore.marketplace.service.TiendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tiendas")
@RequiredArgsConstructor
public class TiendaController {

    private final TiendaService tiendaService;

    @GetMapping
    public List<Tienda> listar() {
        return tiendaService.listar();
    }

    @GetMapping("/{id}")
    public Tienda obtener(@PathVariable Long id) {
        return tiendaService.obtener(id);
    }

    @PostMapping
    public Tienda guardar(@RequestBody Tienda tienda) {
        return tiendaService.guardar(tienda);
    }

    @PutMapping("/{id}")
    public Tienda actualizar(@PathVariable Long id,
                             @RequestBody Tienda tienda) {

        return tiendaService.actualizar(id, tienda);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        tiendaService.eliminar(id);
    }
}