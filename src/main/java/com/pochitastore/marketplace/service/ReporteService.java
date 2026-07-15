package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Orden;
import com.pochitastore.marketplace.repository.OrdenRepository;
import com.pochitastore.marketplace.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;

    public Map<String, Object> obtenerEstadisticasAdmin() {
        Map<String, Object> stats = new HashMap<>();

        List<Orden> todasLasOrdenes = ordenRepository.findAll();
        
        double ingresosTotales = 0;
        int ordenesCompletadas = 0;
        double[] ventasPorMes = new double[12]; // Enero a Diciembre

        for (Orden orden : todasLasOrdenes) {
            // Solo sumamos ingresos de órdenes exitosas
            if ("COMPLETADA".equals(orden.getEstadoGeneral()) || "PAGADA".equals(orden.getEstadoGeneral())) {
                ingresosTotales += orden.getTotal();
                ordenesCompletadas++;
                
                if (orden.getCreatedAt() != null) {
                    int mesIndex = orden.getCreatedAt().getMonthValue() - 1;
                    ventasPorMes[mesIndex] += orden.getTotal();
                }
            }
        }

        long totalClientes = usuarioRepository.findByRol("CLIENTE").size();
        long totalVendedores = usuarioRepository.findByRol("VENDEDOR").size();

        stats.put("ingresosTotales", ingresosTotales);
        stats.put("totalOrdenes", todasLasOrdenes.size());
        stats.put("ordenesExitosas", ordenesCompletadas);
        stats.put("totalClientes", totalClientes);
        stats.put("totalVendedores", totalVendedores);
        stats.put("ventasPorMes", ventasPorMes);

        // Simulamos ventas por categoría para el gráfico de dona
        Map<String, Integer> ventasPorCategoria = new HashMap<>();
        ventasPorCategoria.put("Electrónica", 45);
        ventasPorCategoria.put("Ropa", 25);
        ventasPorCategoria.put("Hogar", 20);
        ventasPorCategoria.put("Juguetes", 10);
        stats.put("ventasPorCategoria", ventasPorCategoria);

        return stats;
    }
}
