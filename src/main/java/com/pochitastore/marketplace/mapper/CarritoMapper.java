package com.pochitastore.marketplace.mapper;

import com.pochitastore.marketplace.dto.*;
import com.pochitastore.marketplace.entity.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CarritoMapper {

    public static CarritoDTO toDTO(Carrito carrito) {

        if (carrito == null) {
            return null;
        }

        List<CarritoItem> items = carrito.getItems() == null
                ? new ArrayList<>()
                : carrito.getItems();

        List<CarritoItemDTO> itemsDTO = items.stream()
                .map(item -> toItemDTO(item)) // EVITA method reference error
                .collect(Collectors.toList());

        double total = itemsDTO.stream()
                .mapToDouble(CarritoItemDTO::getSubtotal)
                .sum();

        return CarritoDTO.builder()
                .idCarrito(carrito.getIdCarrito())
                .usuario(toUsuarioDTO(carrito.getUsuario()))
                .estado(carrito.getEstado())
                .createdAt(carrito.getCreatedAt())
                .updatedAt(carrito.getUpdatedAt())
                .items(itemsDTO)
                .total(total)
                .build();
    }

    private static UsuarioDTO toUsuarioDTO(Usuario usuario) {

        if (usuario == null) {
            return null;
        }

        return UsuarioDTO.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .email(usuario.getEmail())
                .build();
    }

    public static CarritoItemDTO toItemDTO(CarritoItem item) {

        if (item == null) {
            return null;
        }

        double subtotal = 0.0;

        if (item.getCantidad() != null && item.getPrecioUnitario() != null) {
            subtotal = item.getCantidad() * item.getPrecioUnitario();
        }

        String imagen = null;

        if (item.getProducto() != null &&
                item.getProducto().getImagenes() != null &&
                !item.getProducto().getImagenes().isEmpty()) {

            imagen = item.getProducto().getImagenes().stream()
                    .filter(img -> img.getEsPrincipal() != null && img.getEsPrincipal())
                    .findFirst()
                    .map(img -> img.getUrl())
                    .orElse(
                            item.getProducto().getImagenes()
                                    .get(0)
                                    .getUrl());
        }

        return CarritoItemDTO.builder()
                .idCarritoItem(item.getIdCarritoItem())
                .idProducto(item.getProducto() != null ? item.getProducto().getIdProducto() : null)
                .nombreProducto(item.getProducto() != null ? item.getProducto().getNombre() : null)
                .cantidad(item.getCantidad())
                .precioUnitario(item.getPrecioUnitario())
                .subtotal(subtotal)
                .imagen(imagen)
                .build();
    }
}