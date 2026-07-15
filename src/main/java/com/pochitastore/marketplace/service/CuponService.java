package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Cupon;
import com.pochitastore.marketplace.repository.CuponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CuponService {

    private final CuponRepository cuponRepository;

    public List<Cupon> listarCupones() {
        return cuponRepository.findAll();
    }

    public Cupon crearCupon(Cupon cupon) {
        cupon.setCodigo(cupon.getCodigo().toUpperCase()); // Siempre en mayúsculas
        cupon.setCreatedAt(LocalDateTime.now());
        return cuponRepository.save(cupon);
    }

    public Cupon alternarEstado(Long id) {
        Cupon cupon = cuponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));
        cupon.setActivo(!cupon.getActivo());
        return cuponRepository.save(cupon);
    }

    public void eliminarCupon(Long id) {
        cuponRepository.deleteById(id);
    }

    // Usado por el cliente en el carrito
    public Cupon validarCupon(String codigo) {
        Cupon cupon = cuponRepository.findByCodigo(codigo.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Cupón no válido o no existe"));

        if (!cupon.getActivo()) {
            throw new RuntimeException("Este cupón está desactivado");
        }

        if (cupon.getFechaExpiracion() != null && cupon.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Este cupón ha expirado");
        }

        return cupon;
    }
}
