package com.pochitastore.marketplace.service;

import com.pochitastore.marketplace.entity.Usuario;
import com.pochitastore.marketplace.entity.Vendedor;
import com.pochitastore.marketplace.repository.UsuarioRepository;
import com.pochitastore.marketplace.repository.VendedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final VendedorRepository vendedorRepository;

    private final PasswordEncoder passwordEncoder;


    public Usuario registrarCliente(
            Usuario usuario
    ) {

        // validar email

        if (usuarioRepository.findByEmail(
                usuario.getEmail()
        ).isPresent()) {

            throw new RuntimeException(
                    "El email ya está registrado"
            );
        }

        usuario.setPassword(
                passwordEncoder.encode(
                        usuario.getPassword()
                )
        );

        usuario.setRol("CLIENTE");

        usuario.setEstado(true);

        usuario.setCreatedAt(
                LocalDateTime.now()
        );

        usuario.setUpdatedAt(
                LocalDateTime.now()
        );

        return usuarioRepository.save(usuario);
    }


    public Usuario obtenerUsuario(
            Long idUsuario
    ) {

        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );
    }


    public Usuario actualizarPerfil(
            Long idUsuario,
            Usuario datos
    ) {

        Usuario usuario =
                obtenerUsuario(idUsuario);

        usuario.setNombres(
                datos.getNombres()
        );

        usuario.setApellidos(
                datos.getApellidos()
        );

        usuario.setUpdatedAt(
                LocalDateTime.now()
        );

        return usuarioRepository.save(usuario);
    }


    public Usuario desactivarCuenta(
            Long idUsuario
    ) {

        Usuario usuario =
                obtenerUsuario(idUsuario);

        usuario.setEstado(false);

        usuario.setUpdatedAt(
                LocalDateTime.now()
        );

        return usuarioRepository.save(usuario);
    }

    public Vendedor convertirEnVendedor(
            Long idUsuario
    ) {

        Usuario usuario =
                obtenerUsuario(idUsuario);

        // validar si ya es vendedor

        if (usuario.getRol()
                .equals("VENDEDOR")) {

            throw new RuntimeException(
                    "El usuario ya es vendedor"
            );
        }

        // cambiar rol

        usuario.setRol("VENDEDOR");

        usuario.setUpdatedAt(
                LocalDateTime.now()
        );

        usuarioRepository.save(usuario);

        // crear vendedor

        Vendedor vendedor =
                new Vendedor();

        vendedor.setUsuario(usuario);

        vendedor.setActivo(true);

        vendedor.setEstadoVerificacion(false);

        vendedor.setCreatedAt(
                LocalDateTime.now()
        );

        vendedor.setUpdatedAt(
                LocalDateTime.now()
        );

        return vendedorRepository.save(vendedor);
    }
}