package com.pochitastore.marketplace.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas
                .requestMatchers("/api/auth/**", "/api/usuarios/registro").permitAll()
                // Gestión de usuarios — solo ADMIN
                .requestMatchers("/api/usuarios/**").hasAuthority("ADMIN")
                // Crear, editar y eliminar productos — VENDEDOR o ADMIN
                .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyAuthority("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("VENDEDOR", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyAuthority("VENDEDOR", "ADMIN")
                // Cualquier otra ruta — usuario autenticado
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
} 