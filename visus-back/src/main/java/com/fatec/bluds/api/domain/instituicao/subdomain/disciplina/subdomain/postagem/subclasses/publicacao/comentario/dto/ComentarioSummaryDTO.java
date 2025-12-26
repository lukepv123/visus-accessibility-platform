package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.model.Comentario;
import com.fatec.bluds.api.domain.usuario.dto.UsuarioSummaryDTO;

import java.time.LocalDateTime;
import java.util.List;

public record ComentarioSummaryDTO(
        Long id,
        String conteudo,
        UsuarioSummaryDTO autor,
        LocalDateTime dataCriacao,
        List<RespostaAComentarioSummaryDTO> respostas
) {
    public ComentarioSummaryDTO(Comentario comentario) {
        this(
                comentario.getId(),
                comentario.getConteudo(),
                new UsuarioSummaryDTO(comentario.getAutor()),
                comentario.getDataCriacao(),
                comentario.getRespostas().stream().map(RespostaAComentarioSummaryDTO::new).toList()
        );
    }
}
