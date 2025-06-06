package com.calendario.calendario_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/festivos")
public class FestivoController {

    private final RestTemplate restTemplate;

    public FestivoController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

}
