package com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto;

import com.fatec.bluds.api.domain.usuario.enums.Genero;

import java.time.LocalDate;

public record EstudanteUpdateDTO(
        String nome,
        String telefone,
        Genero genero,
        LocalDate dataNascimento
) {}
