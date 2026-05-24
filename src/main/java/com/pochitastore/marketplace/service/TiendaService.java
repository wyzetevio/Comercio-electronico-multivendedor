package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Tienda;
import com.pochitastore.marketplace.repository.TiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TiendaService {

    private final TiendaRepository tiendaRepository;

    public List<Tienda> listar() {
        return tiendaRepository.findAll();
    }

    public Tienda obtener(Long id) {
        return tiendaRepository.findById(id).orElse(null);
    }

    public Tienda guardar(Tienda tienda) {
        return tiendaRepository.save(tienda);
    }

    public Tienda actualizar(Long id, Tienda tienda) {

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