package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Tienda;
import com.pochitastore.marketplace.entity.Vendedor;
import com.pochitastore.marketplace.repository.TiendaRepository;
import com.pochitastore.marketplace.repository.VendedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TiendaService {

    private final TiendaRepository tiendaRepository;
    private final VendedorRepository vendedorRepository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public List<Tienda> listar() {
        return tiendaRepository.findAll();
    }

    public Tienda obtener(Long id) {
        return tiendaRepository.findById(id).orElse(null);
    }

    @org.springframework.transaction.annotation.Transactional
    public Tienda guardar(Long idUsuario, Tienda tienda) {
        try {
            entityManager.createNativeQuery("ALTER TABLE tienda ALTER COLUMN descripcion TYPE TEXT").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE tienda ALTER COLUMN logo TYPE TEXT").executeUpdate();
        } catch (Exception e) {
            // Ignorar
        }
        Vendedor vendedor = vendedorRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado para este usuario"));
        tienda.setVendedor(vendedor);
        tienda.setActivo(true);
        tienda.setCreatedAt(LocalDateTime.now());
        tienda.setUpdatedAt(LocalDateTime.now());
        return tiendaRepository.save(tienda);
    }

    @org.springframework.transaction.annotation.Transactional
    public Tienda actualizar(Long id, Tienda tienda) {
        try {
            entityManager.createNativeQuery("ALTER TABLE tienda ALTER COLUMN descripcion TYPE TEXT").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE tienda ALTER COLUMN logo TYPE TEXT").executeUpdate();
        } catch (Exception e) {
            // Ignorar si ya es TEXT o si falla en base de datos H2/otra
        }

        Tienda existente = tiendaRepository.findById(id).orElse(null);

        if (existente == null) {
            return null;
        }

        existente.setNombreTienda(tienda.getNombreTienda());
        existente.setDescripcion(tienda.getDescripcion());
        existente.setDireccion(tienda.getDireccion());
        existente.setLogo(tienda.getLogo());
        existente.setActivo(tienda.getActivo());

        return tiendaRepository.save(existente);
    }

    public void eliminar(Long id) {
        tiendaRepository.deleteById(id);
    }
}