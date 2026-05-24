package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Envio;
import com.pochitastore.marketplace.service.EnvioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/envios")
@RequiredArgsConstructor
public class EnvioController {

    private final EnvioService envioService;

    @PostMapping
    public Envio crearEnvio(
            @RequestParam Long idSuborden,
            @RequestParam String empresaEnvio,
            @RequestParam Double costoEnvio
    ) {

        return envioService.crearEnvio(
                idSuborden,
                empresaEnvio,
                costoEnvio
        );
    }

    @GetMapping("/{idEnvio}")
    public Envio obtenerEnvio(
            @PathVariable Long idEnvio
    ) {

        return envioService.obtenerEnvio(idEnvio);
    }

    @GetMapping("/suborden/{idSuborden}")
    public Envio obtenerEnvioSuborden(
            @PathVariable Long idSuborden
    ) {

        return envioService
                .obtenerEnvioSuborden(idSuborden);
    }

    @PutMapping("/{idEnvio}/transito")
    public Envio marcarEnTransito(
            @PathVariable Long idEnvio,
            @RequestParam String codigoTracking
    ) {

        return envioService.marcarEnTransito(
                idEnvio,
                codigoTracking
        );
    }

    @PutMapping("/{idEnvio}/entregar")
    public Envio marcarEntregado(
            @PathVariable Long idEnvio
    ) {

        return envioService.marcarEntregado(idEnvio);
    }


    @PutMapping("/{idEnvio}/devolver")
    public Envio devolverEnvio(
            @PathVariable Long idEnvio
    ) {

        return envioService.devolverEnvio(idEnvio);
    }
}