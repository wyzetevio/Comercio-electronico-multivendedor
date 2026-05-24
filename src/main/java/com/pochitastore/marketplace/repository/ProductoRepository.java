package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository
        extends JpaRepository<Producto, Long> {

    List<Producto> findByEstadoTrue();

    List<Producto> findByTiendaIdTiendaAndEstadoTrue(
            Long idTienda
    );

    List<Producto> findByCategoriaIdCategoriaAndEstadoTrue(
            Long idCategoria
    );

    List<Producto> findByNombreContainingIgnoreCaseAndEstadoTrue(
            String nombre
    );
}