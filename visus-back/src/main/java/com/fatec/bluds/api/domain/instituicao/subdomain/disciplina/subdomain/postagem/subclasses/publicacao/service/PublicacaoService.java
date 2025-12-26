package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto.CreatePublicacaoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto.UpdatePublicacaoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.model.Publicacao;

import java.util.List;

public interface PublicacaoService {
    Publicacao createPublicacao(CreatePublicacaoDTO dto);
    Publicacao getPublicacaoById(Long id);
    List<Publicacao> getPublicacoesByDisciplina(Long disciplinaId);
    Publicacao updatePublicacao(Long publicacaoId, UpdatePublicacaoDTO dto);
    void removePublicacao(Long id);
    
}
