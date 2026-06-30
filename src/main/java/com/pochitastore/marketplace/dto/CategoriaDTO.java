package com.pochitastore.marketplace.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CategoriaDTO {
    private Long idCategoria;
    private String nombre;
    private Integer nivel;
}