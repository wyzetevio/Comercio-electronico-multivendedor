package com.pochitastore.marketplace.controller;

import com.pochitastore.marketplace.entity.Usuario;
import com.pochitastore.marketplace.repository.UsuarioRepository;
import com.pochitastore.marketplace.security.JwtUtil;
import com.pochitastore.marketplace.security.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequest request
    ) {
        // 1. Buscar usuario por email
        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (usuario == null || !usuario.getEstado()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email o contraseña incorrectos"));
        }

        // 2. Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email o contraseña incorrectos"));
        }

        // 3. Generar token JWT usando el email como subject
        String token = jwtUtil.generateToken(usuario.getEmail());

        // 4. Devolver token + datos básicos del usuario
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", usuario.getEmail());
        response.put("nombres", usuario.getNombres());
        response.put("rol", usuario.getRol());

        return ResponseEntity.ok(response);
    }
}
