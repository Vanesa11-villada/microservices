package com.calendario.calendario_api.service;

import com.calendario.calendario_api.model.Calendario;
import com.calendario.calendario_api.model.FestivoDTO;
import com.calendario.calendario_api.model.Tipo;
import com.calendario.calendario_api.repository.CalendarioRepository;
import com.calendario.calendario_api.repository.TipoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

@Service
public class CalendarioService {
    private final CalendarioRepository calRepo;
    private final TipoRepository tipoRepo;
    private final RestTemplate restTemplate;

    public CalendarioService(CalendarioRepository calRepo,
                             TipoRepository tipoRepo,
                             RestTemplate restTemplate) {
        this.calRepo = calRepo;
        this.tipoRepo = tipoRepo;
        this.restTemplate = restTemplate;
    }

    public boolean generarCalendario(int anio) {
        LocalDate inicio = LocalDate.of(anio, 1, 1);
        LocalDate fin    = LocalDate.of(anio, 12, 31);

        if (calRepo.existsByFechaBetween(inicio, fin)) return false;

        Tipo laboral     = ensureTipo("LABORAL");
        Tipo finDeSemana = ensureTipo("FIN_DE_SEMANA");
        Tipo festivoTipo = ensureTipo("FESTIVO");

        List<Calendario> lista = new ArrayList<>();

        for (LocalDate fecha = inicio; !fecha.isAfter(fin); fecha = fecha.plusDays(1)) {
            // 1) Llamar a Express
            String dateStr = String.format("%04d/%02d/%02d",
                    fecha.getYear(), fecha.getMonthValue(), fecha.getDayOfMonth());
            String url = "http://localhost:3000/api/holidays?date=" + dateStr;
            Map<String,String> resp = restTemplate.getForObject(url, Map.class);
            String msg = resp.get("message");

            // 2) Clasificar
            Tipo tipoEntity;
            String descripcion = null;

            if ("Es Festivo".equalsIgnoreCase(msg)) {
                tipoEntity = festivoTipo;
                descripcion = msg; // o msg.replace("Es ","") para solo el nombre
            }
            else if (fecha.getDayOfWeek().getValue() >= 6) {
                tipoEntity = finDeSemana;
            }
            else {
                tipoEntity = laboral;
            }

            // 3) Crear entidad
            lista.add(new Calendario(null, fecha, tipoEntity, descripcion));
        }

        calRepo.saveAll(lista);
        return true;
    }

    // Helper para crear o recuperar un Tipo
    private Tipo ensureTipo(String nombre) {
        return tipoRepo.findByNombre(nombre)
                .orElseGet(() -> tipoRepo.save(new Tipo(null, nombre)));
    }

    public List<Calendario> listarCalendario(int anio) {
        LocalDate inicio = LocalDate.of(anio,1,1);
        LocalDate fin = LocalDate.of(anio,12,31);
        return calRepo.findByFechaBetween(inicio, fin);
    }
}
