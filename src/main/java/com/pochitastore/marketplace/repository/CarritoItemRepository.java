package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarritoItemRepository
        extends JpaRepository<CarritoItem, Long> {

    Optional<CarritoItem>
    findByCarritoIdCarritoAndProductoIdProducto(
            Long carritoId,
            Long productoId
    );

    List<CarritoItem>
    findByCarritoIdCarrito(Long carritoId);
}