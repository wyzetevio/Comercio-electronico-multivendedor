package com.pochitastore.marketplace.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarritoItemDTO {

    private Long idCarritoItem;

    private Long idProducto;
    private String nombreProducto;

    private Integer cantidad;

    private Double precioUnitario;

    private Double subtotal;

    private String imagen;
}