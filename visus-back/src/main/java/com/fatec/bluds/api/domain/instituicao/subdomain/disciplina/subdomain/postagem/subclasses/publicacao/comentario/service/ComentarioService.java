package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.CreateComentarioDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.UpdateComentarioDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.model.Comentario;

import java.util.List;

public interface ComentarioService {
    Comentario responderPublicacao(Long publicacaoId, CreateComentarioDTO dto);
    Comentario responderComentario(Long comentarioId, CreateComentarioDTO dto);
    Comentario getComentarioById(Long comentarioId);
    List<Comentario> listarComentariosDePublicacao(Long publicacaoId);
    Comentario atualizarComentario(Long comentarioId, UpdateComentarioDTO dto);
    void removerComentario(Long comentarioId);
}
