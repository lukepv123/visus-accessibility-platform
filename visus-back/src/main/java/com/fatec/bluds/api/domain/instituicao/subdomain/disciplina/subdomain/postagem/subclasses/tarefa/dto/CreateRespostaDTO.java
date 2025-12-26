package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema
public record CreateRespostaDTO(
        @NotNull Long tarefaId,
        @NotNull Long estudanteId,
        String caminhoAnexo,
        String conteudoTexto
) {}
