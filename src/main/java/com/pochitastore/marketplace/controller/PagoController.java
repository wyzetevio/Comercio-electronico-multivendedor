package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Pago;
import com.pochitastore.marketplace.service.PagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagoController {

    private final PagoService pagoService;

    @PostMapping
    public Pago registrarPago(
            @RequestParam Long idOrden,
            @RequestParam String metodoPago
    ) {

        return pagoService.registrarPago(
                idOrden,
                metodoPago
        );
    }

    @PutMapping("/{idPago}/aprobar")
    public Pago aprobarPago(
            @PathVariable Long idPago
    ) {

        return pagoService.aprobarPago(idPago);
    }

    @PutMapping("/{idPago}/rechazar")
    public Pago rechazarPago(
            @PathVariable Long idPago
    ) {

        return pagoService.rechazarPago(idPago);
    }

    @PutMapping("/{idPago}/reembolsar")
    public Pago reembolsarPago(
            @PathVariable Long idPago
    ) {

        return pagoService.reembolsarPago(idPago);
    }

    @GetMapping("/{idPago}")
    public Pago obtenerPago(
            @PathVariable Long idPago
    ) {

        return pagoService.obtenerPagoPorId(idPago);
    }

    @GetMapping("/orden/{idOrden}")
    public List<Pago> obtenerPagosOrden(
            @PathVariable Long idOrden
    ) {

        return pagoService.obtenerPagosOrden(idOrden);
    }

    @GetMapping("/todos")
    public List<Pago> obtenerTodosLosPagos() {
        return pagoService.obtenerTodosLosPagos();
    }
}