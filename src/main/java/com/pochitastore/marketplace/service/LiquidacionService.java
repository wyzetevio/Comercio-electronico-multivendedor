package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.*;
import com.pochitastore.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LiquidacionService {

        private final LiquidacionRepository liquidacionRepository;

        private final DetalleLiquidacionRepository detalleLiquidacionRepository;

        private final SubordenRepository subordenRepository;

        private final VendedorRepository vendedorRepository;
        private final TiendaRepository tiendaRepository;

        public Liquidacion crearLiquidacion(Long idTienda) {
                // 1. Obtener Tienda y Vendedor
                Tienda tienda = tiendaRepository.findById(idTienda)
                                .orElseThrow(() -> new RuntimeException("Tienda no encontrada"));
                Vendedor vendedor = tienda.getVendedor();

                // 2. Buscar ventas entregadas sin liquidar automáticamente
                List<Suborden> subordenesPendientes = subordenRepository
                                .findSubordenesPendientesDeLiquidacion(idTienda);

                if (subordenesPendientes.isEmpty()) {
                        throw new RuntimeException("No tienes ventas entregadas pendientes por liquidar.");
                }

                // 3. Crear Liquidación
                Liquidacion liquidacion = new Liquidacion();
                liquidacion.setVendedor(vendedor);
                liquidacion.setMontoTotal(0.0);
                liquidacion.setEstadoPago("PENDIENTE");
                liquidacion.setCreatedAt(LocalDateTime.now());
                Liquidacion liquidacionGuardada = liquidacionRepository.save(liquidacion);

                double totalGeneral = 0;

                // 4. Crear los Detalles
                for (Suborden suborden : subordenesPendientes) {
                        DetalleLiquidacion detalle = new DetalleLiquidacion();
                        detalle.setLiquidacion(liquidacionGuardada);
                        detalle.setSuborden(suborden);
                        detalle.setMontoBruto(suborden.getSubtotal());
                        detalle.setComision(suborden.getComision());
                        detalle.setMontoNeto(suborden.getTotalVendedor());

                        detalleLiquidacionRepository.save(detalle);
                        totalGeneral += suborden.getTotalVendedor();
                }

                // 5. Actualizar monto final
                liquidacionGuardada.setMontoTotal(totalGeneral);
                return liquidacionRepository.save(liquidacionGuardada);
        }

        public Liquidacion obtenerLiquidacion(
                        Long idLiquidacion) {

                return liquidacionRepository.findById(idLiquidacion)
                                .orElseThrow(() -> new RuntimeException(
                                                "Liquidación no encontrada"));
        }

        public List<Liquidacion> obtenerLiquidacionesVendedor(
                        Long idVendedor) {

                return liquidacionRepository
                                .findByVendedorIdVendedor(idVendedor);
        }

        public Liquidacion marcarPagada(
                        Long idLiquidacion) {

                Liquidacion liquidacion = obtenerLiquidacion(idLiquidacion);

                liquidacion.setEstadoPago("PAGADA");

                liquidacion.setFechaPago(
                                LocalDateTime.now());

                return liquidacionRepository
                                .save(liquidacion);
        }

        public Liquidacion rechazarLiquidacion(
                        Long idLiquidacion) {

                Liquidacion liquidacion = obtenerLiquidacion(idLiquidacion);

                liquidacion.setEstadoPago("RECHAZADA");

                return liquidacionRepository
                                .save(liquidacion);
        }
}