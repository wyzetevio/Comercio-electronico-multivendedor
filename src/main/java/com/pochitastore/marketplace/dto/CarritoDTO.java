package com.pochitastore.marketplace.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarritoDTO {

    private Long idCarrito;

    private UsuarioDTO usuario;

    private String estado;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<CarritoItemDTO> items;

    private Double total;
}