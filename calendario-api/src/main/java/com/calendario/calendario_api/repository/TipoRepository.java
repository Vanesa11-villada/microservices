package com.calendario.calendario_api.repository;

import com.calendario.calendario_api.model.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoRepository extends JpaRepository<Tipo, Long> {
    Optional<Tipo> findByNombre(String nombre);
}
