package com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto;

import com.fatec.bluds.api.domain.usuario.enums.Genero;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;

import java.time.LocalDate;

public record EstudanteSummaryDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    String matricula,
    Periodo periodo,
    AnoEscolar anoEscolar,
    String telefone,
    Genero genero,
    LocalDate dataNascimento
) {
    public EstudanteSummaryDTO(Estudante estudante) {
        this(
                estudante.getId(),
                estudante.getNome(),
                estudante.getCpf(),
                estudante.getEmail(),
                estudante.getMatricula(),
                estudante.getPeriodo(),
                estudante.getAnoEscolar(),
                estudante.getTelefone(),
                estudante.getGenero(),
                estudante.getDataNascimento()
        );

    }
}
