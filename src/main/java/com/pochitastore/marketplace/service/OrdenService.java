package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.*;
import com.pochitastore.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final SubordenRepository subordenRepository;

    private final DireccionRepository direccionRepository;
    private final DetalleSubordenRepository detalleSubordenRepository;
    private final ProductoService productoService;

    private final CarritoService carritoService;

    public List<Orden> obtenerOrdenesDelCliente(Long idUsuario) {
        return ordenRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public Orden obtenerOrdenPorId(Long idOrden) {
        return ordenRepository.findById(idOrden)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }

    public Orden crearOrden(Orden orden) {

        orden.setCreatedAt(LocalDateTime.now());
        orden.setUpdatedAt(LocalDateTime.now());

        orden.setEstadoGeneral("PENDIENTE");

        return ordenRepository.save(orden);
    }

    public Orden marcarComoPagada(Long idOrden) {

        Orden orden = obtenerOrdenPorId(idOrden);

        orden.setEstadoGeneral("PAGADA");
        orden.setUpdatedAt(LocalDateTime.now());

        return ordenRepository.save(orden);
    }

    public Orden cancelarOrden(Long idOrden) {

        Orden orden = obtenerOrdenPorId(idOrden);

        orden.setEstadoGeneral("CANCELADA");
        orden.setUpdatedAt(LocalDateTime.now());

        return ordenRepository.save(orden);
    }

    public Orden completarOrden(Long idOrden) {

        Orden orden = obtenerOrdenPorId(idOrden);

        orden.setEstadoGeneral("COMPLETADA");
        orden.setUpdatedAt(LocalDateTime.now());

        return ordenRepository.save(orden);
    }

    public List<Suborden> obtenerSubordenes(Long idOrden) {
        return subordenRepository.findByOrdenIdOrden(idOrden);
    }

    public Orden crearOrdenDesdeCarrito(
            Long usuarioId,
            Long direccionId
    ) {

        // OBTENER CARRITO

        Carrito carrito = carritoService
                .obtenerCarritoUsuario(usuarioId);

        if (carrito == null) {
            throw new RuntimeException("Carrito no encontrado");
        }

        List<CarritoItem> items = carrito.getItems();

        if (items.isEmpty()) {
            throw new RuntimeException("El carrito está vacío");
        }

        // OBTENER DIRECCIÓN

        Direccion direccion = direccionRepository
                .findById(direccionId)
                .orElseThrow(() ->
                        new RuntimeException("Dirección no encontrada")
                );

        // CALCULAR TOTAL

        double total = 0;

        for (CarritoItem item : items) {

            total += item.getCantidad()
                    * item.getPrecioUnitario();
        }

        // CREAR ORDEN

        Orden orden = new Orden();

        orden.setUsuario(carrito.getUsuario());

        orden.setDireccion(direccion);

        orden.setTotal(total);

        orden.setEstadoGeneral("PENDIENTE");

        orden.setCreatedAt(LocalDateTime.now());
        orden.setUpdatedAt(LocalDateTime.now());

        Orden ordenGuardada = ordenRepository.save(orden);

        // MAPA DE SUBORDENES

        Map<Long, Suborden> subordenesMap =
                new HashMap<>();

        // RECORRER ITEMS

        for (CarritoItem item : items) {

            Producto producto = item.getProducto();

            Long tiendaId = producto
                    .getTienda()
                    .getIdTienda();

            Suborden suborden =
                    subordenesMap.get(tiendaId);

            // CREAR SUBORDEN

            if (suborden == null) {

                suborden = new Suborden();

                suborden.setOrden(ordenGuardada);

                suborden.setTienda(
                        producto.getTienda()
                );

                suborden.setSubtotal(0.0);

                suborden.setComision(0.0);

                suborden.setTotalVendedor(0.0);

                suborden.setEstado("PENDIENTE");

                suborden.setCreatedAt(
                        LocalDateTime.now()
                );

                suborden.setUpdatedAt(
                        LocalDateTime.now()
                );

                suborden =
                        subordenRepository.save(suborden);

                subordenesMap.put(
                        tiendaId,
                        suborden
                );
            }

            // CALCULAR SUBTOTAL ITEM

            double subtotalItem =
                    item.getCantidad()
                            * item.getPrecioUnitario();

            suborden.setSubtotal(
                    suborden.getSubtotal()
                            + subtotalItem
            );

            // COMISIÓN 10%

            double comision =
                    subtotalItem * 0.10;

            suborden.setComision(
                    suborden.getComision()
                            + comision
            );

            suborden.setTotalVendedor(
                    suborden.getSubtotal()
                            - suborden.getComision()
            );

            subordenRepository.save(suborden);

            // CREAR DETALLE

            DetalleSuborden detalle =
                    new DetalleSuborden();

            detalle.setSuborden(suborden);

            detalle.setProducto(producto);

            detalle.setCantidad(
                    item.getCantidad()
            );

            detalle.setPrecioUnitario(
                    item.getPrecioUnitario()
            );

            detalleSubordenRepository.save(detalle);

            // DESCONTAR STOCK

            productoService.reducirStock(
                    producto.getIdProducto(),
                    item.getCantidad()
            );
        }

        // VACIAR CARRITO

        carritoService.vaciarCarrito(
                carrito.getIdCarrito()
        );

        return ordenGuardada;
    }

}