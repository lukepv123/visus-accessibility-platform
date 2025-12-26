package com.fatec.bluds.api.domain.usuario.subclasses.gestor.dto;

import com.fatec.bluds.api.domain.instituicao.dto.InstituicaoDetailsDTO;
import com.fatec.bluds.api.domain.usuario.enums.Genero;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.model.Gestor;

import java.time.LocalDate;

public record GestorDetailsDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        String telefone,
        Genero genero,
        LocalDate dataNascimento,
        String cargo,
        InstituicaoDetailsDTO instituicao
) {
    public GestorDetailsDTO(Gestor gestor) {
        this(
                gestor.getId(),
                gestor.getNome(),
                gestor.getCpf(),
                gestor.getEmail(),
                gestor.getTelefone(),
                gestor.getGenero(),
                gestor.getDataNascimento(),
                gestor.getCargo(),
                gestor.getInstituicaoEnsino() != null ? new InstituicaoDetailsDTO(gestor.getInstituicaoEnsino()) : null
        );
    }
}
