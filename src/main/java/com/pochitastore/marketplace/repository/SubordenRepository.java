package com.pochitastore.marketplace.repository;

import com.pochitastore.marketplace.entity.Suborden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubordenRepository extends JpaRepository<Suborden, Long> {

    List<Suborden> findByOrdenIdOrden(Long idOrden);

    List<Suborden> findByTiendaIdTienda(Long idTienda);

    @Query("SELECT s FROM Suborden s WHERE s.tienda.idTienda = :idTienda AND s.estado = 'ENTREGADA' AND s.idSuborden NOT IN (SELECT dl.suborden.idSuborden FROM DetalleLiquidacion dl)")
    List<Suborden> findSubordenesPendientesDeLiquidacion(@Param("idTienda") Long idTienda);

}