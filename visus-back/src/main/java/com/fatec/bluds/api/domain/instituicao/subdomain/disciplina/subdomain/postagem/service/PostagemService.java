package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.model.Postagem;

import java.util.List;

public interface PostagemService {
    List<Postagem> getPostagensByDisciplina(Long disciplinaId);
}
