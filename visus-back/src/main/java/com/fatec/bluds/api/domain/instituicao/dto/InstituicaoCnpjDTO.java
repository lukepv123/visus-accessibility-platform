package com.fatec.bluds.api.domain.instituicao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema
public record InstituicaoCnpjDTO(
        @NotBlank
        String cnpj
) {
}
