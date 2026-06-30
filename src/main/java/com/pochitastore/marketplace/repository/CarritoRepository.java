package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CarritoRepository
        extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByUsuarioIdUsuario(Long usuarioId);

    @Query("SELECT c FROM Carrito c LEFT JOIN FETCH c.items WHERE c.usuario.idUsuario = :usuarioId")
    Optional<Carrito> findByUsuarioIdWithItems(Long usuarioId);
}