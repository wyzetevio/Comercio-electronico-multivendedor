package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pochitastore.marketplace.entity.Usuario;
import java.util.Optional;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
    Optional<Vendedor> findByUsuario(Usuario usuario);
    Optional<Vendedor> findByUsuario_IdUsuario(Long idUsuario);
}