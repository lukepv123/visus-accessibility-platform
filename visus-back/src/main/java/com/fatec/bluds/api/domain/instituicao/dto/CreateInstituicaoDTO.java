package com.fatec.bluds.api.domain.instituicao.dto;

import com.fatec.bluds.api.domain.instituicao.endereco.Endereco;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema
public record CreateInstituicaoDTO(
        @NotBlank
        String nome,

        @NotBlank
        String telefone,

        @NotBlank
        String cnpj,

        @NotBlank
        @Email
        String email,

        @NotNull
        @Valid
        Endereco endereco
) {
}
