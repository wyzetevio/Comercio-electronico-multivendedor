package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    List<Direccion> findByUsuario_IdUsuario(Long idUsuario);
}