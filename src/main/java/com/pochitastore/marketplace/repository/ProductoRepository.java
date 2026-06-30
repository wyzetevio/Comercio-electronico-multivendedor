package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

    List<Producto> findByCategoriaNombreIgnoreCaseAndEstadoTrue(
            String nombre
    );

    List<Producto> findByPrecioBetweenAndEstadoTrue(
            Double min,
            Double max
    );

    @Query("SELECT p FROM Producto p JOIN FETCH p.imagenes WHERE p.idProducto = :id")
    Producto findWithImages(Long id);
}