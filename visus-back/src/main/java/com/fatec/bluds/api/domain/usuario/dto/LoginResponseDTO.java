package com.fatec.bluds.api.domain.usuario.dto;

public record LoginResponseDTO(
        String token,
        UsuarioDetailsDTO usuario) {
}
