package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categoria")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Long idCategoria;

    @Column(nullable = false)
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "id_padre")
    private Categoria categoriaPadre;

    private Integer nivel;

    private Boolean activo;
}