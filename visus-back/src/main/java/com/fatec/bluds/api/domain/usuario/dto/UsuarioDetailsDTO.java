package com.fatec.bluds.api.domain.usuario.dto;

import com.fatec.bluds.api.domain.instituicao.dto.InstituicaoDetailsDTO;
import com.fatec.bluds.api.domain.usuario.enums.Genero;
import com.fatec.bluds.api.domain.usuario.roles.Roles;
import com.fatec.bluds.api.domain.usuario.model.Usuario;

import java.time.LocalDate;

public record UsuarioDetailsDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        Genero genero,
        LocalDate dataNascimento,
        InstituicaoDetailsDTO instituicao,
        Roles roles
) {
     public UsuarioDetailsDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getGenero(),
                usuario.getDataNascimento(),
                usuario.getInstituicaoEnsino() != null ? new InstituicaoDetailsDTO(usuario.getInstituicaoEnsino()) : null,
                usuario.getRoles()
        );
    }
}
