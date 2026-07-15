package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupones")
@Data
public class Cupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCupon;

    @Column(unique = true, nullable = false)
    private String codigo;

    // Descuento en porcentaje (ejemplo: 10 para 10%)
    @Column(nullable = false)
    private Double descuentoPorcentaje;

    @Column(nullable = false)
    private Boolean activo = true;

    private LocalDateTime fechaExpiracion;

    private LocalDateTime createdAt = LocalDateTime.now();
}
