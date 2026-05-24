package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Vendedor;
import com.pochitastore.marketplace.repository.VendedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendedorService {

    private final VendedorRepository vendedorRepository;


    public List<Vendedor> obtenerVendedores() {

        return vendedorRepository.findAll();
    }


    public Vendedor obtenerVendedor(
            Long idVendedor
    ) {

        return vendedorRepository.findById(idVendedor)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vendedor no encontrado"
                        )
                );
    }

    public Vendedor verificarVendedor(
            Long idVendedor
    ) {

        Vendedor vendedor =
                obtenerVendedor(idVendedor);

        vendedor.setEstadoVerificacion(true);

        vendedor.setUpdatedAt(
                LocalDateTime.now()
        );

        return vendedorRepository.save(vendedor);
    }


    public Vendedor suspenderVendedor(
            Long idVendedor
    ) {

        Vendedor vendedor =
                obtenerVendedor(idVendedor);

        vendedor.setActivo(false);

        vendedor.setUpdatedAt(
                LocalDateTime.now()
        );

        return vendedorRepository.save(vendedor);
    }


    public Vendedor activarVendedor(
            Long idVendedor
    ) {

        Vendedor vendedor =
                obtenerVendedor(idVendedor);

        vendedor.setActivo(true);

        vendedor.setUpdatedAt(
                LocalDateTime.now()
        );

        return vendedorRepository.save(vendedor);
    }
}