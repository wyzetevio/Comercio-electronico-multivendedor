package com.pochitastore.marketplace.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ProductoDTO {

    private Long idProducto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Boolean estado;

    private CategoriaDTO categoria;
    private TiendaDTO tienda;

    private List<ImagenProductoDTO> imagenes;

    private String imagenPrincipal;

    private String stockStatus;
}