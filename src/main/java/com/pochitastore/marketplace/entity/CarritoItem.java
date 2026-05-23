package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carrito_item")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CarritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito_item")
    private Long idCarritoItem;

    @ManyToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    private Integer cantidad;

    @Column(name = "precio_unitario")
    private Double precioUnitario;
}