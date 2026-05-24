package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Envio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnvioRepository
        extends JpaRepository<Envio, Long> {

    Optional<Envio> findBySubordenIdSuborden(
            Long idSuborden
    );
}