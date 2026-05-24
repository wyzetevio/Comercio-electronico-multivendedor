package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Categoria;
import com.pochitastore.marketplace.entity.Producto;
import com.pochitastore.marketplace.entity.Tienda;
import com.pochitastore.marketplace.repository.CategoriaRepository;
import com.pochitastore.marketplace.repository.ProductoRepository;
import com.pochitastore.marketplace.repository.TiendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    private final TiendaRepository tiendaRepository;

    private final CategoriaRepository categoriaRepository;

    public Producto crearProducto(
            Long idTienda,
            Long idCategoria,
            Producto producto
    ) {

        // validar tienda

        Tienda tienda =
                tiendaRepository.findById(idTienda)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Tienda no encontrada"
                                )
                        );

        // validar categoría

        Categoria categoria =
                categoriaRepository.findById(idCategoria)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Categoría no encontrada"
                                )
                        );

        // validar stock

        if (producto.getStock() < 0) {

            throw new RuntimeException(
                    "El stock no puede ser negativo"
            );
        }

        // validar precio

        if (producto.getPrecio() <= 0) {

            throw new RuntimeException(
                    "El precio debe ser mayor a 0"
            );
        }

        producto.setTienda(tienda);

        producto.setCategoria(categoria);

        producto.setEstado(true);

        producto.setCreatedAt(LocalDateTime.now());

        producto.setUpdatedAt(LocalDateTime.now());

        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(
            Long idProducto,
            Producto datos
    ) {

        Producto producto =
                obtenerProducto(idProducto);

        producto.setNombre(datos.getNombre());

        producto.setDescripcion(
                datos.getDescripcion()
        );

        producto.setPrecio(datos.getPrecio());

        producto.setStock(datos.getStock());

        producto.setUpdatedAt(
                LocalDateTime.now()
        );

        return productoRepository.save(producto);
    }

    public Producto desactivarProducto(
            Long idProducto
    ) {

        Producto producto =
                obtenerProducto(idProducto);

        producto.setEstado(false);

        producto.setUpdatedAt(
                LocalDateTime.now()
        );

        return productoRepository.save(producto);
    }

    public Producto activarProducto(
            Long idProducto
    ) {

        Producto producto =
                obtenerProducto(idProducto);

        producto.setEstado(true);

        producto.setUpdatedAt(
                LocalDateTime.now()
        );

        return productoRepository.save(producto);
    }

    public Producto obtenerProducto(
            Long idProducto
    ) {

        return productoRepository.findById(idProducto)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Producto no encontrado"
                        )
                );
    }

    public List<Producto> obtenerProductosActivos() {

        return productoRepository.findByEstadoTrue();
    }


    public List<Producto> obtenerProductosTienda(
            Long idTienda
    ) {

        return productoRepository
                .findByTiendaIdTiendaAndEstadoTrue(
                        idTienda
                );
    }

    public List<Producto> obtenerProductosCategoria(
            Long idCategoria
    ) {

        return productoRepository
                .findByCategoriaIdCategoriaAndEstadoTrue(
                        idCategoria
                );
    }

    public List<Producto> buscarProductos(
            String nombre
    ) {

        return productoRepository
                .findByNombreContainingIgnoreCaseAndEstadoTrue(
                        nombre
                );
    }

    public Producto actualizarStock(
            Long idProducto,
            Integer nuevoStock
    ) {

        Producto producto =
                obtenerProducto(idProducto);

        if (nuevoStock < 0) {

            throw new RuntimeException(
                    "Stock inválido"
            );
        }

        producto.setStock(nuevoStock);

        producto.setUpdatedAt(
                LocalDateTime.now()
        );

        return productoRepository.save(producto);
    }

    public void reducirStock(
            Long idProducto,
            Integer cantidad
    ) {

        Producto producto =
                obtenerProducto(idProducto);

        if (producto.getStock() < cantidad) {

            throw new RuntimeException(
                    "Stock insuficiente"
            );
        }

        producto.setStock(
                producto.getStock() - cantidad
        );

        producto.setUpdatedAt(
                LocalDateTime.now()
        );

        productoRepository.save(producto);
    }
}