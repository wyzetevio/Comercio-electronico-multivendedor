package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "liquidacion")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Liquidacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_liquidacion")
    private Long idLiquidacion;

    @ManyToOne
    @JoinColumn(name = "id_vendedor", nullable = false)
    private Vendedor vendedor;

    @Column(name = "monto_total")
    private Double montoTotal;

    @Column(name = "estado_pago")
    private String estadoPago;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}