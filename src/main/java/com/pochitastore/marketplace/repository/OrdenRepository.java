package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByUsuarioIdUsuario(Long idUsuario);

}