package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_suborden")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DetalleSuborden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_suborden", nullable = false)
    private Suborden suborden;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    private Integer cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;
}