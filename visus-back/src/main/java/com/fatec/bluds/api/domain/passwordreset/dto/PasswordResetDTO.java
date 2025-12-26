package com.fatec.bluds.api.domain.passwordreset.dto;

import jakarta.validation.constraints.NotBlank;

public record PasswordResetDTO(
        @NotBlank
        String token,

        @NotBlank
        String password
) {
}
