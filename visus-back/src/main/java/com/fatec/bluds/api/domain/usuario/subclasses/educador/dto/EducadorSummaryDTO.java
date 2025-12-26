package com.fatec.bluds.api.domain.usuario.subclasses.educador.dto;

import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Educador;

public record EducadorSummaryDTO(
        Long id,
        String nome,
        String email,
        String matricula,
        String titulo
) {
    public EducadorSummaryDTO(Educador educador) {
        this(educador.getId(), educador.getNome(), educador.getEmail(), educador.getMatricula(), educador.getTitulo());
    }
}
