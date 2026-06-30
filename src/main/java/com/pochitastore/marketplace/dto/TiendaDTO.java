package com.pochitastore.marketplace.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class TiendaDTO {
    private Long idTienda;
    private String nombreTienda;
    private String logo;
}