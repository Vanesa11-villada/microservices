package com.calendario.calendario_api.service;

import com.calendario.calendario_api.model.Calendario;
import com.calendario.calendario_api.model.Tipo;
import com.calendario.calendario_api.repository.CalendarioRepository;
import com.calendario.calendario_api.repository.TipoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class CalendarioService {
    private final CalendarioRepository calRepo;
    private final TipoRepository tipoRepo;
    private final RestTemplate restTemplate;
    private final String festivosApiUrl;

    // Inyectamos FESTIVOS_API_URL junto al resto de dependencias
    public CalendarioService(CalendarioRepository calRepo,
                             TipoRepository tipoRepo,
                             RestTemplate restTemplate,
                             @Value("${FESTIVOS_API_URL}") String festivosApiUrl) {
        this.calRepo = calRepo;
        this.tipoRepo = tipoRepo;
        this.restTemplate = restTemplate;
        this.festivosApiUrl = festivosApiUrl;
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
            // 1) Llamar a Express usando la URL inyectada
            String dateStr = String.format("%04d/%02d/%02d",
                    fecha.getYear(), fecha.getMonthValue(), fecha.getDayOfMonth());
            String url = festivosApiUrl + "?date=" + dateStr;
            @SuppressWarnings("unchecked")
            Map<String, String> resp = restTemplate.getForObject(url, Map.class);
            String msg = resp.get("message");

            // 2) Clasificar según mensaje o día de la semana
            Tipo tipoEntity;
            String descripcion = null;
            if ("Es Festivo".equalsIgnoreCase(msg)) {
                tipoEntity = festivoTipo;
                descripcion = msg;
            } else if (fecha.getDayOfWeek().getValue() >= 6) {
                tipoEntity = finDeSemana;
            } else {
                tipoEntity = laboral;
            }

            lista.add(new Calendario(null, fecha, tipoEntity, descripcion));
        }

        calRepo.saveAll(lista);
        return true;
    }

    private Tipo ensureTipo(String nombre) {
        return tipoRepo.findByNombre(nombre)
                .orElseGet(() -> tipoRepo.save(new Tipo(null, nombre)));
    }

    public List<Calendario> listarCalendario(int anio) {
        LocalDate inicio = LocalDate.of(anio, 1, 1);
        LocalDate fin    = LocalDate.of(anio, 12, 31);
        return calRepo.findByFechaBetween(inicio, fin);
    }
}
