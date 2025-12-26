package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Schema
public record UpdateTarefaDTO(
        String titulo,

        String conteudo,

        @FutureOrPresent(message = "Data de expiração deve ser presente ou futura")
        LocalDateTime dataExpiracao,

        @Positive(message = "Valor total deve ser positivo")
        Double valorTotal,

        Boolean permitirArquivoResposta
) {}