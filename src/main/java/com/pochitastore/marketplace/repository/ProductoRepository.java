package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByEstadoTrue();

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByCategoria_IdCategoria(Long idCategoria);

    List<Producto> findByTienda_IdTienda(Long idTienda);
}