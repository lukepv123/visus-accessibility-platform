package com.fatec.bluds.api.domain.instituicao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema
public record InstituicaoEmailDTO(
        @Email
        @NotBlank
        String email
) {
}
