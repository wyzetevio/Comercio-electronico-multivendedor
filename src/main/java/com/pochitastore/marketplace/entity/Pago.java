package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pago")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;

    @ManyToOne
    @JoinColumn(name = "id_orden", nullable = false)
    private Orden orden;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @Column(name = "monto_total")
    private Double montoTotal;

    private String estado;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}