package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Resena;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    List<Resena> findByProducto_IdProducto(Long idProducto);
}