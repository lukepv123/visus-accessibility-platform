package com.fatec.bluds.api.domain.passwordreset.dto;

import jakarta.validation.constraints.Email;

public record RequestResetDTO(
        @Email
        String email
) {
}
