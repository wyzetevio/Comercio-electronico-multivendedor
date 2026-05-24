package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.DetalleLiquidacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleLiquidacionRepository
        extends JpaRepository<DetalleLiquidacion, Long> {
}