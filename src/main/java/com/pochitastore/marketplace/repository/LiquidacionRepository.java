package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Liquidacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiquidacionRepository
        extends JpaRepository<Liquidacion, Long> {

    List<Liquidacion> findByVendedorIdVendedor(
            Long idVendedor
    );
}