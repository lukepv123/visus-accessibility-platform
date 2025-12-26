package com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto;

import com.fatec.bluds.api.domain.instituicao.dto.InstituicaoDetailsDTO;
import com.fatec.bluds.api.domain.usuario.enums.Genero;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;

import java.time.LocalDate;

public record EstudanteResponseDTO(
    Long id,
    String nome,
    String cpf,
    String email,
    String matricula,
    Periodo periodo,
    AnoEscolar anoEscolar,
    String telefone,
    Genero genero,
    LocalDate dataNascimento,
    InstituicaoDetailsDTO instituicao
) {
    public EstudanteResponseDTO(Estudante estudante) {
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
                estudante.getDataNascimento(),
                estudante.getInstituicaoEnsino() != null ? new InstituicaoDetailsDTO(estudante.getInstituicaoEnsino()) : null
        );

    }
}
