package com.pochitastore.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_liquidacion")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DetalleLiquidacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_liquidacion")
    private Long idDetalleLiquidacion;

    @ManyToOne
    @JoinColumn(name = "id_liquidacion", nullable = false)
    private Liquidacion liquidacion;

    @OneToOne
    @JoinColumn(name = "id_suborden", nullable = false, unique = true)
    private Suborden suborden;

    @Column(name = "monto_bruto")
    private Double montoBruto;

    private Double comision;

    @Column(name = "monto_neto")
    private Double montoNeto;
}