package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema
public record CreateDisciplinaDTO(
        @NotBlank(message = "Nome da disciplina não pode ser vazio ou nulo")
        String nome,

        @NotBlank(message = "Descrição da disciplina não pode ser vazio ou nulo")
        String descricao,

        @NotNull
        Long idEducadorResponsavel,

        @NotNull
        Long idInstituicao
) {
}
