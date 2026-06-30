package com.pochitastore.marketplace.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ImagenProductoDTO {
    private Long idImagen;
    private String url;
    private Boolean esPrincipal;
    private Integer posicion;
}