package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Envio;
import com.pochitastore.marketplace.entity.Suborden;
import com.pochitastore.marketplace.repository.EnvioRepository;
import com.pochitastore.marketplace.repository.SubordenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EnvioService {

    private final EnvioRepository envioRepository;
    private final SubordenRepository subordenRepository;


    public Envio crearEnvio(
            Long idSuborden,
            String empresaEnvio,
            Double costoEnvio
    ) {

        Suborden suborden =
                subordenRepository.findById(idSuborden)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Suborden no encontrada"
                                )
                        );

        Envio envio = new Envio();

        envio.setSuborden(suborden);

        envio.setEmpresaEnvio(empresaEnvio);

        envio.setCostoEnvio(costoEnvio);

        envio.setEstadoEnvio("PENDIENTE");

        envio.setCreatedAt(LocalDateTime.now());
        envio.setUpdatedAt(LocalDateTime.now());

        return envioRepository.save(envio);
    }

    public Envio obtenerEnvio(Long idEnvio) {

        return envioRepository.findById(idEnvio)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Envío no encontrado"
                        )
                );
    }

    public Envio obtenerEnvioSuborden(
            Long idSuborden
    ) {

        return envioRepository
                .findBySubordenIdSuborden(idSuborden)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Envío no encontrado"
                        )
                );
    }

    public Envio marcarEnTransito(
            Long idEnvio,
            String codigoTracking
    ) {

        Envio envio = obtenerEnvio(idEnvio);

        envio.setEstadoEnvio("EN_TRANSITO");

        envio.setCodigoTracking(codigoTracking);

        envio.setUpdatedAt(LocalDateTime.now());

        return envioRepository.save(envio);
    }

    public Envio marcarEntregado(Long idEnvio) {

        Envio envio = obtenerEnvio(idEnvio);

        envio.setEstadoEnvio("ENTREGADO");

        envio.setUpdatedAt(LocalDateTime.now());

        // actualizar suborden

        Suborden suborden = envio.getSuborden();

        suborden.setEstado("ENTREGADA");

        subordenRepository.save(suborden);

        return envioRepository.save(envio);
    }


    public Envio devolverEnvio(Long idEnvio) {

        Envio envio = obtenerEnvio(idEnvio);

        envio.setEstadoEnvio("DEVUELTO");

        envio.setUpdatedAt(LocalDateTime.now());

        return envioRepository.save(envio);
    }
}