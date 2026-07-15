package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Usuario;
import com.pochitastore.marketplace.entity.Vendedor;
import com.pochitastore.marketplace.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

        private final UsuarioService usuarioService;

        @PostMapping("/registro")
        public Usuario registrarCliente(
                        @RequestBody Usuario usuario) {

                return usuarioService
                                .registrarCliente(usuario);
        }

        @GetMapping("/{idUsuario}")
        public Usuario obtenerUsuario(
                        @PathVariable Long idUsuario) {

                return usuarioService
                                .obtenerUsuario(idUsuario);
        }

        @PutMapping("/{idUsuario}")
        public Usuario actualizarPerfil(
                        @PathVariable Long idUsuario,
                        @RequestBody Usuario usuario) {

                return usuarioService
                                .actualizarPerfil(
                                                idUsuario,
                                                usuario);
        }

        @PutMapping("/{idUsuario}/desactivar")
        public Usuario desactivarCuenta(
                        @PathVariable Long idUsuario) {

                return usuarioService
                                .desactivarCuenta(idUsuario);
        }

        @PostMapping("/{idUsuario}/vendedor")
        public Vendedor convertirEnVendedor(
                        @PathVariable Long idUsuario) {

                return usuarioService
                                .convertirEnVendedor(idUsuario);
        }
        // 👇 AGREGA ESTOS ENDPOINTS AL FINAL DE LA CLASE 👇

        @GetMapping("/clientes")
        public java.util.List<Usuario> listarClientes() {
                return usuarioService.listarClientes();
        }

        @PutMapping("/{idUsuario}/toggle-estado")
        public Usuario cambiarEstadoCuenta(@PathVariable Long idUsuario) {
                return usuarioService.cambiarEstadoCuenta(idUsuario);
        }

}