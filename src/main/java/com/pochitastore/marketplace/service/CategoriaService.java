package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Categoria;
import com.pochitastore.marketplace.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;


    public Categoria crearCategoria(
            Categoria categoria
    ) {

        categoria.setActivo(true);

        return categoriaRepository.save(categoria);
    }


    public List<Categoria> obtenerCategorias() {

        return categoriaRepository.findAll();
    }


    public Categoria obtenerCategoria(
            Long idCategoria
    ) {

        return categoriaRepository.findById(idCategoria)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Categoría no encontrada"
                        )
                );
    }


    public Categoria actualizarCategoria(
            Long idCategoria,
            Categoria datos
    ) {

        Categoria categoria =
                obtenerCategoria(idCategoria);

        categoria.setNombre(
                datos.getNombre()
        );

        categoria.setNivel(
                datos.getNivel()
        );

        categoria.setCategoriaPadre(
                datos.getCategoriaPadre()
        );

        return categoriaRepository.save(categoria);
    }


    public Categoria desactivarCategoria(
            Long idCategoria
    ) {

        Categoria categoria =
                obtenerCategoria(idCategoria);

        categoria.setActivo(false);

        return categoriaRepository.save(categoria);
    }
}