package com.pochitastore.marketplace.mapper;

import com.pochitastore.marketplace.dto.CategoriaDTO;
import com.pochitastore.marketplace.dto.ProductoDTO;
import com.pochitastore.marketplace.dto.TiendaDTO;
import com.pochitastore.marketplace.entity.ImagenProducto;
import com.pochitastore.marketplace.entity.Producto;
import org.springframework.stereotype.Component;

@Component
public class ProductoMapper {

    public ProductoDTO toDTO(Producto p) {

        String imagenPrincipal = p.getImagenes()
                .stream()
                .filter(ImagenProducto::getEsPrincipal)
                .findFirst()
                .map(ImagenProducto::getUrl)
                .orElse(
                        p.getImagenes().isEmpty()
                                ? null
                                : p.getImagenes().get(0).getUrl()
                );

        String stockStatus = calcularStockStatus(p.getStock());

        return ProductoDTO.builder()
                .idProducto(p.getIdProducto())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .stock(p.getStock())
                .estado(p.getEstado())

                .categoria(
                        new CategoriaDTO(
                                p.getCategoria().getIdCategoria(),
                                p.getCategoria().getNombre(),
                                p.getCategoria().getNivel()
                        )
                )

                .tienda(
                        new TiendaDTO(
                                p.getTienda().getIdTienda(),
                                p.getTienda().getNombreTienda(),
                                p.getTienda().getLogo()
                        )
                )

                .imagenPrincipal(imagenPrincipal)
                .stockStatus(stockStatus)

                .build();
    }

    public String calcularStockStatus(Integer stock) {
        if (stock == 0) return "OUT_OF_STOCK";
        if (stock <= 5) return "LOW_STOCK";
        return "AVAILABLE";
    }
}