package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}