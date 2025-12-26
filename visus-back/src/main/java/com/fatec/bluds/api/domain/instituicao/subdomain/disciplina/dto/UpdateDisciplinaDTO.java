package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto;

public record UpdateDisciplinaDTO(
        String nome,
        String descricao,
        Long idEducadorResponsavel
) {
}
