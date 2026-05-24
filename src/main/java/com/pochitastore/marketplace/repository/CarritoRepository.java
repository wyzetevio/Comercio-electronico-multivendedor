package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarritoRepository
        extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByUsuarioIdUsuario(Long usuarioId);
}