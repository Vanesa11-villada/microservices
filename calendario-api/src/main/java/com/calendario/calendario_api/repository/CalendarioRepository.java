package com.calendario.calendario_api.repository;

import com.calendario.calendario_api.model.Calendario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CalendarioRepository extends JpaRepository<Calendario, Long> {
    List<Calendario> findByFechaBetween(LocalDate inicio, LocalDate fin);
    boolean existsByFechaBetween(LocalDate inicio, LocalDate fin);
}