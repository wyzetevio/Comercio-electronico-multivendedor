package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Suborden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubordenRepository extends JpaRepository<Suborden, Long> {

    List<Suborden> findByTienda_IdTienda(Long idTienda);

    List<Suborden> findByEstado(String estado);
}