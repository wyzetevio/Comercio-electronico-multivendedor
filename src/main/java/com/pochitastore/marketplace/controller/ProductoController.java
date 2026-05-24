package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Producto;
import com.pochitastore.marketplace.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @PostMapping
    public Producto crearProducto(
            @RequestParam Long idTienda,
            @RequestParam Long idCategoria,
            @RequestBody Producto producto
    ) {

        return productoService.crearProducto(
                idTienda,
                idCategoria,
                producto
        );
    }

    @PutMapping("/{idProducto}")
    public Producto actualizarProducto(
            @PathVariable Long idProducto,
            @RequestBody Producto producto
    ) {

        return productoService.actualizarProducto(
                idProducto,
                producto
        );
    }

    @GetMapping("/{idProducto}")
    public Producto obtenerProducto(
            @PathVariable Long idProducto
    ) {

        return productoService.obtenerProducto(
                idProducto
        );
    }

    @GetMapping
    public List<Producto> obtenerProductosActivos() {

        return productoService.obtenerProductosActivos();
    }


    @GetMapping("/tienda/{idTienda}")
    public List<Producto> obtenerProductosTienda(
            @PathVariable Long idTienda
    ) {

        return productoService.obtenerProductosTienda(
                idTienda
        );
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<Producto> obtenerProductosCategoria(
            @PathVariable Long idCategoria
    ) {

        return productoService.obtenerProductosCategoria(
                idCategoria
        );
    }

    @GetMapping("/buscar")
    public List<Producto> buscarProductos(
            @RequestParam String nombre
    ) {

        return productoService.buscarProductos(
                nombre
        );
    }

    @PutMapping("/{idProducto}/stock")
    public Producto actualizarStock(
            @PathVariable Long idProducto,
            @RequestParam Integer stock
    ) {

        return productoService.actualizarStock(
                idProducto,
                stock
        );
    }

    @PutMapping("/{idProducto}/desactivar")
    public Producto desactivarProducto(
            @PathVariable Long idProducto
    ) {

        return productoService.desactivarProducto(
                idProducto
        );
    }

    @PutMapping("/{idProducto}/activar")
    public Producto activarProducto(
            @PathVariable Long idProducto
    ) {

        return productoService.activarProducto(
                idProducto
        );
    }
}