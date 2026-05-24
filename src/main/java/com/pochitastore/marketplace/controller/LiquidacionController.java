package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Liquidacion;
import com.pochitastore.marketplace.service.LiquidacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/liquidaciones")
@RequiredArgsConstructor
public class LiquidacionController {

    private final LiquidacionService liquidacionService;

    @PostMapping
    public Liquidacion crearLiquidacion(
            @RequestParam Long idVendedor,
            @RequestBody List<Long> idsSubordenes
    ) {

        return liquidacionService.crearLiquidacion(
                idVendedor,
                idsSubordenes
        );
    }

    @GetMapping("/{idLiquidacion}")
    public Liquidacion obtenerLiquidacion(
            @PathVariable Long idLiquidacion
    ) {

        return liquidacionService
                .obtenerLiquidacion(idLiquidacion);
    }

    @GetMapping("/vendedor/{idVendedor}")
    public List<Liquidacion>
    obtenerLiquidacionesVendedor(
            @PathVariable Long idVendedor
    ) {

        return liquidacionService
                .obtenerLiquidacionesVendedor(idVendedor);
    }

    @PutMapping("/{idLiquidacion}/pagar")
    public Liquidacion marcarPagada(
            @PathVariable Long idLiquidacion
    ) {

        return liquidacionService
                .marcarPagada(idLiquidacion);
    }

    @PutMapping("/{idLiquidacion}/rechazar")
    public Liquidacion rechazarLiquidacion(
            @PathVariable Long idLiquidacion
    ) {

        return liquidacionService
                .rechazarLiquidacion(idLiquidacion);
    }
}