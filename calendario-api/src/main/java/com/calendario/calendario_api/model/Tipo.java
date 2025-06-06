package com.calendario.calendario_api.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tipo")
public class Tipo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Valores: "LABORAL", "FIN_DE_SEMANA", "FESTIVO"
    @Column(nullable = false, unique = true)
    private String nombre;

    // Opcional: lista de calendarios asociados
    @OneToMany(mappedBy = "tipo")
    private List<Calendario> calendarios;

    public Tipo() {}
    public Tipo(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
