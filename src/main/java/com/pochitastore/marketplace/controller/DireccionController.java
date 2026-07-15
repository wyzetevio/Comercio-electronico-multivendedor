package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Direccion;
import com.pochitastore.marketplace.entity.Usuario;
import com.pochitastore.marketplace.repository.DireccionRepository;
import com.pochitastore.marketplace.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DireccionController {

    private final DireccionRepository direccionRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/usuario/{usuarioId}")
    public List<Direccion> listarPorUsuario(@PathVariable Long usuarioId) {
        return direccionRepository.findByUsuario_IdUsuarioAndActivoTrue(usuarioId);
    }

    @PostMapping
    public ResponseEntity<?> guardarDireccion(@RequestBody Direccion direccion, @RequestParam Long usuarioId) {
        return usuarioRepository.findById(usuarioId).map(usuario -> {
            direccion.setUsuario(usuario);
            if (direccion.getCreatedAt() == null) {
                direccion.setCreatedAt(LocalDateTime.now());
            }
            if (direccion.getActivo() == null) {
                direccion.setActivo(true);
            }
            
            // Si es predeterminada, quitar el flag de las otras
            if (Boolean.TRUE.equals(direccion.getEsPredeterminada())) {
                List<Direccion> otras = direccionRepository.findByUsuario_IdUsuarioAndActivoTrue(usuarioId);
                for (Direccion d : otras) {
                    if (!d.getIdDireccion().equals(direccion.getIdDireccion())) {
                        d.setEsPredeterminada(false);
                    }
                }
                direccionRepository.saveAll(otras);
            }
            
            Direccion guardada = direccionRepository.save(direccion);
            return ResponseEntity.ok(guardada);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return direccionRepository.findById(id).map(direccion -> {
            direccion.setActivo(false);
            direccionRepository.save(direccion);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
