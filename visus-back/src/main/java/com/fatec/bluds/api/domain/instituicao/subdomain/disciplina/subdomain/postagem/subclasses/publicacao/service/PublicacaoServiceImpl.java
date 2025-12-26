package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.service.DisciplinaService;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto.CreatePublicacaoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto.UpdatePublicacaoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.model.Publicacao;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.repository.PublicacaoRepository;
import com.fatec.bluds.api.infra.exceptions.general.UnauthorizedActionException;
import com.fatec.bluds.api.infra.exceptions.postagem.PostagemNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicacaoServiceImpl implements PublicacaoService {

    private final PublicacaoRepository publicacaoRepository;
    private final DisciplinaService disciplinaService;

    public PublicacaoServiceImpl(PublicacaoRepository publicacaoRepository, DisciplinaService disciplinaService) {
        this.publicacaoRepository = publicacaoRepository;
        this.disciplinaService = disciplinaService;
    }

    @Override
    public Publicacao createPublicacao(CreatePublicacaoDTO dto) {
        Disciplina disciplina = disciplinaService.getDisciplinaById(dto.disciplinaId());

        if (!disciplina.getEducador().getId().equals(dto.educadorId())) {
            throw new UnauthorizedActionException("Somente o Educador responsável por uma Disciplina pode realizar postagens nela.");
        }

        Publicacao publicacao = new Publicacao();
        publicacao.setTitulo(dto.titulo());
        publicacao.setConteudo(dto.conteudo());
        publicacao.setCaminhoAnexo(dto.caminhoAnexo());
        publicacao.setAutor(disciplina.getEducador());
        publicacao.setDisciplina(disciplina);

        return publicacaoRepository.save(publicacao);
    }

    @Override
    public Publicacao getPublicacaoById(Long id) {
        return publicacaoRepository.findById(id).orElseThrow(
                () -> new PostagemNotFoundException("Publicação com ID " + id + " não encontrada")
        );
    }

    @Override
    public List<Publicacao> getPublicacoesByDisciplina(Long disciplinaId) {
        return publicacaoRepository.findByDisciplinaId(disciplinaId);
    }

    @Transactional
    @Override
    public Publicacao updatePublicacao(Long publicacaoId, UpdatePublicacaoDTO dto) {
        Publicacao publicacao = this.getPublicacaoById(publicacaoId);

        Optional.ofNullable(dto.titulo())
                .filter(titulo -> !titulo.isBlank())
                .ifPresent(publicacao::setTitulo);

        Optional.ofNullable(dto.conteudo())
                .filter(conteudo -> !conteudo.isBlank())
                .ifPresent(publicacao::setConteudo);

        Optional.ofNullable(dto.caminhoAnexo())
                .filter(caminho -> !caminho.isBlank())
                .ifPresent(publicacao::setCaminhoAnexo);

        return publicacaoRepository.save(publicacao);
    }

    @Transactional
    @Override
    public void removePublicacao(Long id) {
        Publicacao publicacao = this.getPublicacaoById(id);

        publicacaoRepository.delete(publicacao);
    }
}
