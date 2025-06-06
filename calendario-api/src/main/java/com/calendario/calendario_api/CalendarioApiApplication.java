package com.calendario.calendario_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class CalendarioApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CalendarioApiApplication.class, args);
    }
}
