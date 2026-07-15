package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orden")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_direccion", nullable = false)
    private Direccion direccion;

    private Double total;

    @Column(name = "estado_general")
    private String estadoGeneral;

    @Column(name = "descuento")
    private Double descuento = 0.0;

    @Column(name = "codigo_cupon")
    private String codigoCupon;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}