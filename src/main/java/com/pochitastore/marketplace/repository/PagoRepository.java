package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByOrdenIdOrden(Long idOrden);
}