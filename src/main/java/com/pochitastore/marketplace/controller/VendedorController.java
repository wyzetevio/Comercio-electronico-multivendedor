package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Vendedor;
import com.pochitastore.marketplace.service.VendedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendedores")
@RequiredArgsConstructor
public class VendedorController {

    private final VendedorService vendedorService;

    @GetMapping
    public List<Vendedor> obtenerVendedores() {

        return vendedorService.obtenerVendedores();
    }


    @GetMapping("/{idVendedor}")
    public Vendedor obtenerVendedor(
            @PathVariable Long idVendedor
    ) {

        return vendedorService
                .obtenerVendedor(idVendedor);
    }

    @PutMapping("/{idVendedor}/verificar")
    public Vendedor verificarVendedor(
            @PathVariable Long idVendedor
    ) {

        return vendedorService
                .verificarVendedor(idVendedor);
    }

    @PutMapping("/{idVendedor}/suspender")
    public Vendedor suspenderVendedor(
            @PathVariable Long idVendedor
    ) {

        return vendedorService
                .suspenderVendedor(idVendedor);
    }

    @PutMapping("/{idVendedor}/activar")
    public Vendedor activarVendedor(
            @PathVariable Long idVendedor
    ) {

        return vendedorService
                .activarVendedor(idVendedor);
    }
}