package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CuponRepository extends JpaRepository<Cupon, Long> {
    Optional<Cupon> findByCodigo(String codigo);
    java.util.List<Cupon> findByActivoTrue();
}
