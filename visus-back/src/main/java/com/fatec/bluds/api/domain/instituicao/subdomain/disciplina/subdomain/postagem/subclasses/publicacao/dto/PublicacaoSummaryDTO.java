package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.model.Publicacao;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema
public record PublicacaoSummaryDTO(
        Long id,
        String titulo,
        LocalDateTime dataEnvio
) {
    public PublicacaoSummaryDTO(Publicacao publicacao) {
        this(
                publicacao.getId(),
                publicacao.getTitulo(),
                publicacao.getDataEnvio()
        );
    }
}
