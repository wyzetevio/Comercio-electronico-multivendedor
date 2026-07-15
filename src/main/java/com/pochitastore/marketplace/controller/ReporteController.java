package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/stats")
    public Map<String, Object> obtenerEstadisticasAdmin() {
        return reporteService.obtenerEstadisticasAdmin();
    }
}
