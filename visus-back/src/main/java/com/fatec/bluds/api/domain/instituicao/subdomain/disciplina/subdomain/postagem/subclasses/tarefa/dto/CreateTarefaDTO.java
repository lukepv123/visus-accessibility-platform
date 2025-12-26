package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Schema
public record CreateTarefaDTO(
        @NotBlank(message = "Título é obrigatório")
        String titulo,

        @NotBlank(message = "Conteúdo (descrição) é obrigatório")
        String conteudo,

        @NotNull(message = "ID da disciplina é obrigatório")
        Long disciplinaId,

        @NotNull(message = "ID do autor (educador) é obrigatório")
        Long autorId,

        @NotNull(message = "Data de expiração é obrigatória")
        @FutureOrPresent(message = "Data de expiração deve ser presente ou futura")
        LocalDateTime dataExpiracao,

        @NotNull(message = "Valor total é obrigatório")
        @Positive(message = "Valor total deve ser positivo")
        Double valorTotal,

        Boolean permitirArquivoResposta
) {}
