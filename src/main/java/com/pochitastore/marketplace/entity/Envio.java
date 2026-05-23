package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "envio")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_envio")
    private Long idEnvio;

    @OneToOne
    @JoinColumn(name = "id_suborden", nullable = false, unique = true)
    private Suborden suborden;

    @Column(name = "empresa_envio")
    private String empresaEnvio;

    @Column(name = "codigo_tracking")
    private String codigoTracking;

    @Column(name = "estado_envio")
    private String estadoEnvio;

    @Column(name = "costo_envio")
    private Double costoEnvio;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}