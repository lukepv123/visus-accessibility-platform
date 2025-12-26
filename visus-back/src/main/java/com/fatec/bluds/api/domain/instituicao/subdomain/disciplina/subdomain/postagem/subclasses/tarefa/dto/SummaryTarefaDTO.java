package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.model.Tarefa;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema
public record SummaryTarefaDTO(
        Long id,
        String titulo,
        String resumoConteudo,
        LocalDateTime dataCriacao,
        LocalDateTime dataExpiracao,
        Double valorTotal,
        String educadorResponsavel,
        Long disciplinaId
) {
    public SummaryTarefaDTO(Tarefa t) {
        this(
                t.getId(),
                t.getTitulo(),
                t.getConteudo() != null && t.getConteudo().length() > 120
                        ? t.getConteudo().substring(0, 120) + "..."
                        : t.getConteudo(),
                t.getDataEnvio(),
                t.getDataExpiracao(),
                t.getValorTotal(),
                t.getAutor() != null ? t.getAutor().getNome() : null,
                t.getDisciplina() != null ? t.getDisciplina().getId() : null
        );
    }
}
