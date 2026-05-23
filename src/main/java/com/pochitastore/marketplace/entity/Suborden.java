package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "suborden")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Suborden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suborden")
    private Long idSuborden;

    @ManyToOne
    @JoinColumn(name = "id_orden", nullable = false)
    private Orden orden;

    @ManyToOne
    @JoinColumn(name = "id_tienda", nullable = false)
    private Tienda tienda;

    private Double subtotal;

    private Double comision;

    @Column(name = "total_vendedor")
    private Double totalVendedor;

    private String estado;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}