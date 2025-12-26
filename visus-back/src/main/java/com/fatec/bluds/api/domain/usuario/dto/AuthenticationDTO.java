package com.fatec.bluds.api.domain.usuario.dto;

public record AuthenticationDTO(
        String email,
        String senha) {
}
