package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
}