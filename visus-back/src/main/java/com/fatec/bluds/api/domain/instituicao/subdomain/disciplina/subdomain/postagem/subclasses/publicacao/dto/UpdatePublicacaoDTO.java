package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema
public record UpdatePublicacaoDTO(
        String titulo,
        String conteudo,
        String caminhoAnexo
) {
}
