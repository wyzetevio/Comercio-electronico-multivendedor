package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Categoria;
import com.pochitastore.marketplace.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;


    @PostMapping
    public Categoria crearCategoria(
            @RequestBody Categoria categoria
    ) {

        return categoriaService
                .crearCategoria(categoria);
    }


    @GetMapping
    public List<Categoria> obtenerCategorias() {

        return categoriaService
                .obtenerCategorias();
    }


    @GetMapping("/{idCategoria}")
    public Categoria obtenerCategoria(
            @PathVariable Long idCategoria
    ) {

        return categoriaService
                .obtenerCategoria(idCategoria);
    }


    @PutMapping("/{idCategoria}")
    public Categoria actualizarCategoria(
            @PathVariable Long idCategoria,
            @RequestBody Categoria categoria
    ) {

        return categoriaService
                .actualizarCategoria(
                        idCategoria,
                        categoria
                );
    }


    @PutMapping("/{idCategoria}/desactivar")
    public Categoria desactivarCategoria(
            @PathVariable Long idCategoria
    ) {

        return categoriaService
                .desactivarCategoria(idCategoria);
    }
}