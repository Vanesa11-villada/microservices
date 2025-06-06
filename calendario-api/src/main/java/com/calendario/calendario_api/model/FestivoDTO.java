package com.calendario.calendario_api.model;

public class FestivoDTO {
    private int year;
    private int month;
    private int day;
    private String name;

    public FestivoDTO() {}

    public FestivoDTO(int year, int month, int day, String name) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.name = name;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getDay() {
        return day;
    }

    public void setDay(int day) {
        this.day = day;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}


