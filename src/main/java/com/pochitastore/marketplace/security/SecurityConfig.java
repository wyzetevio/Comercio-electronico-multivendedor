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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas de autenticación y registro
                        .requestMatchers("/api/auth/**", "/api/usuarios/registro").permitAll()
                        // Acceso público de lectura para el catálogo de productos, categorías y tiendas
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tiendas/**").permitAll()
                        // Convertirse en vendedor (cualquier usuario autenticado)
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/*/vendedor").authenticated()
                        // Gestión de usuarios — solo ADMIN
                        .requestMatchers("/api/usuarios/**").hasAuthority("ADMIN")
                        // Crear y editar categorías — solo ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/categorias/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasAuthority("ADMIN")
                        // Crear, editar y eliminar productos — VENDEDOR o ADMIN
                        .requestMatchers(HttpMethod.POST, "/api/productos/**").hasAnyAuthority("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyAuthority("VENDEDOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyAuthority("VENDEDOR", "ADMIN")
                        // Cualquier otra ruta (compras, perfiles, etc.) — usuario autenticado
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permitir peticiones desde tu frontend en desarrollo
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Permitir métodos HTTP estándar
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permitir cabeceras estándar de autenticación y envío de JSON
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
        // Permitir cookies / credenciales de autenticación
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}