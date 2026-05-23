package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "direccion")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long idDireccion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    private String etiqueta;

    private String departamento;

    private String provincia;

    private String distrito;

    private String direccion;

    private String referencia;

    @Column(name = "es_predeterminada")
    private Boolean esPredeterminada;

    private Boolean activo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}