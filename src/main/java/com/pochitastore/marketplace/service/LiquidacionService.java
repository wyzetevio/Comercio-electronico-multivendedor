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

    private final DetalleLiquidacionRepository
            detalleLiquidacionRepository;

    private final SubordenRepository subordenRepository;

    private final VendedorRepository vendedorRepository;


    public Liquidacion crearLiquidacion(
            Long idVendedor,
            List<Long> idsSubordenes
    ) {

        // OBTENER VENDEDOR

        Vendedor vendedor =
                vendedorRepository.findById(idVendedor)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendedor no encontrado"
                                )
                        );

        // CREAR LIQUIDACIÓN

        Liquidacion liquidacion =
                new Liquidacion();

        liquidacion.setVendedor(vendedor);

        liquidacion.setMontoTotal(0.0);

        liquidacion.setEstadoPago("PENDIENTE");

        liquidacion.setCreatedAt(
                LocalDateTime.now()
        );

        Liquidacion liquidacionGuardada =
                liquidacionRepository.save(liquidacion);

        // TOTAL GENERAL

        double totalGeneral = 0;

        // RECORRER SUBORDENES


        for (Long idSuborden : idsSubordenes) {

            Suborden suborden =
                    subordenRepository.findById(idSuborden)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Suborden no encontrada"
                                    )
                            );

            // validar vendedor

            if (!suborden.getTienda()
                    .getVendedor()
                    .getIdVendedor()
                    .equals(idVendedor)) {

                throw new RuntimeException(
                        "La suborden no pertenece al vendedor"
                );
            }

            // validar entregada

            if (!suborden.getEstado()
                    .equals("ENTREGADA")) {

                throw new RuntimeException(
                        "La suborden aún no fue entregada"
                );
            }

            // CREAR DETALLE

            DetalleLiquidacion detalle =
                    new DetalleLiquidacion();

            detalle.setLiquidacion(
                    liquidacionGuardada
            );

            detalle.setSuborden(suborden);

            detalle.setMontoBruto(
                    suborden.getSubtotal()
            );

            detalle.setComision(
                    suborden.getComision()
            );

            detalle.setMontoNeto(
                    suborden.getTotalVendedor()
            );

            detalleLiquidacionRepository
                    .save(detalle);

            totalGeneral +=
                    suborden.getTotalVendedor();
        }

        // ACTUALIZAR TOTAL

        liquidacionGuardada.setMontoTotal(
                totalGeneral
        );

        return liquidacionRepository
                .save(liquidacionGuardada);
    }

    public Liquidacion obtenerLiquidacion(
            Long idLiquidacion
    ) {

        return liquidacionRepository.findById(idLiquidacion)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Liquidación no encontrada"
                        )
                );
    }

    public List<Liquidacion>
    obtenerLiquidacionesVendedor(
            Long idVendedor
    ) {

        return liquidacionRepository
                .findByVendedorIdVendedor(idVendedor);
    }


    public Liquidacion marcarPagada(
            Long idLiquidacion
    ) {

        Liquidacion liquidacion =
                obtenerLiquidacion(idLiquidacion);

        liquidacion.setEstadoPago("PAGADO");

        liquidacion.setFechaPago(
                LocalDateTime.now()
        );

        return liquidacionRepository
                .save(liquidacion);
    }


    public Liquidacion rechazarLiquidacion(
            Long idLiquidacion
    ) {

        Liquidacion liquidacion =
                obtenerLiquidacion(idLiquidacion);

        liquidacion.setEstadoPago("RECHAZADO");

        return liquidacionRepository
                .save(liquidacion);
    }
}