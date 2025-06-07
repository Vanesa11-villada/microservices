package com.calendario.calendario_api.controller;

import com.calendario.calendario_api.model.Calendario;
import com.calendario.calendario_api.service.CalendarioService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendario")
public class CalendarioController {
    private final CalendarioService service;

    @GetMapping("/")
    public String home() {
        return "API Calendario funcionando correctamente!";
    }

    public CalendarioController(CalendarioService service) {
        this.service = service;
    }
    @GetMapping("/generar/{anio}")
    public ResponseEntity<Boolean> generar(@PathVariable int anio) {
        boolean ok = service.generarCalendario(anio);
        return ResponseEntity.ok(ok);
    }

    @GetMapping("/listar/{anio}")
    public ResponseEntity<?> listar(@PathVariable int anio) {
        List<Calendario> calendarios = service.listarCalendario(anio);
        if (calendarios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Calendario no generado para el año " + anio);
        }
        return ResponseEntity.ok(calendarios);
    }

    @GetMapping("/obtener/{anio}")
    public ResponseEntity<?> obtenerFestivos(@PathVariable int anio) {
        List<Calendario> lista = service.listarCalendario(anio);
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Calendario no generado para el año " + anio);
        }
        List<Calendario> festivos = lista.stream()
                .filter(c -> c.getTipo().getNombre().equalsIgnoreCase("FESTIVO"))
                .toList();
        return ResponseEntity.ok(festivos);
    }
}
