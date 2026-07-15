package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.DetalleSuborden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetalleSubordenRepository extends JpaRepository<DetalleSuborden, Long> {
    List<DetalleSuborden> findBySubordenIdSuborden(Long idSuborden);
}