package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {

    List<CarritoItem> findByCarrito_IdCarrito(Long idCarrito);
}