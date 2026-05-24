package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Orden;
import com.pochitastore.marketplace.entity.Pago;
import com.pochitastore.marketplace.repository.OrdenRepository;
import com.pochitastore.marketplace.repository.PagoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final OrdenRepository ordenRepository;

    public Pago registrarPago(
            Long idOrden,
            String metodoPago
    ) {

        Orden orden = ordenRepository.findById(idOrden)
                .orElseThrow(() ->
                        new RuntimeException("Orden no encontrada")
                );

        Pago pago = new Pago();

        pago.setOrden(orden);

        pago.setMetodoPago(metodoPago);

        pago.setMontoTotal(
                orden.getTotal()
        );

        pago.setEstado("PENDIENTE");

        pago.setCreatedAt(LocalDateTime.now());

        return pagoRepository.save(pago);
    }

    public Pago aprobarPago(Long idPago) {

        Pago pago = obtenerPagoPorId(idPago);

        pago.setEstado("APROBADO");

        Pago pagoActualizado =
                pagoRepository.save(pago);

        Orden orden = pago.getOrden();

        orden.setEstadoGeneral("PAGADA");

        ordenRepository.save(orden);

        return pagoActualizado;
    }

    public Pago rechazarPago(Long idPago) {

        Pago pago = obtenerPagoPorId(idPago);

        pago.setEstado("RECHAZADO");

        return pagoRepository.save(pago);
    }

    public Pago reembolsarPago(Long idPago) {

        Pago pago = obtenerPagoPorId(idPago);

        pago.setEstado("REEMBOLSADO");

        return pagoRepository.save(pago);
    }

    public Pago obtenerPagoPorId(Long idPago) {

        return pagoRepository.findById(idPago)
                .orElseThrow(() ->
                        new RuntimeException("Pago no encontrado")
                );
    }


    public List<Pago> obtenerPagosOrden(Long idOrden) {

        return pagoRepository.findByOrdenIdOrden(idOrden);
    }
}