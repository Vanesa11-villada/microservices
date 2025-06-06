package com.calendario.calendario_api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "calendario")
public class Calendario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    // FK a Tipo
    @ManyToOne
    @JoinColumn(name = "tipo_id", nullable = false)
    private Tipo tipo;

    // Descripción solo para días festivos
    private String descripcion;

    public Calendario() {}
    public Calendario(Long id, LocalDate fecha, Tipo tipo, String descripcion) {
        this.id = id;
        this.fecha = fecha;
        this.tipo = tipo;
        this.descripcion = descripcion;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public Tipo getTipo() { return tipo; }
    public void setTipo(Tipo tipo) { this.tipo = tipo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
