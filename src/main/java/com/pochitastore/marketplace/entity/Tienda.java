package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tienda")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tienda")
    private Long idTienda;

    @OneToOne
    @JoinColumn(name = "id_vendedor", nullable = false, unique = true)
    private Vendedor vendedor;

    @Column(name = "nombre_tienda", nullable = false, length = 150)
    private String nombreTienda;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String direccion;

    @Column(columnDefinition = "TEXT")
    private String logo;

    private Boolean activo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}