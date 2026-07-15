package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagen_producto")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ImagenProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen")
    private Long idImagen;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Producto producto;

    @Column(columnDefinition = "TEXT")
    private String url;

    private Integer posicion;

    @Column(name = "es_principal")
    private Boolean esPrincipal;
}