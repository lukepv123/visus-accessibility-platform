package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.model.Comentario;
import com.fatec.bluds.api.domain.usuario.dto.UsuarioSummaryDTO;

import java.time.LocalDateTime;

public record RespostaAComentarioSummaryDTO(
        Long id,
        String conteudo,
        UsuarioSummaryDTO autor,
        LocalDateTime dataCriacao
) {
    public RespostaAComentarioSummaryDTO(Comentario comentario) {
        this(
                comentario.getId(),
                comentario.getConteudo(),
                new UsuarioSummaryDTO(comentario.getAutor()),
                comentario.getDataCriacao()
        );
    }
}
