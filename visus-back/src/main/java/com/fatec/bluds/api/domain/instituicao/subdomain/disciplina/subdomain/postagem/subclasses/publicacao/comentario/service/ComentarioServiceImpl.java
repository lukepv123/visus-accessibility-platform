package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.CreateComentarioDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.UpdateComentarioDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.model.Comentario;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.repository.ComentarioRepository;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.model.Publicacao;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.service.PublicacaoService;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.domain.usuario.service.UsuarioService;
import com.fatec.bluds.api.infra.exceptions.comentario.ComentarioNotFoundException;
import com.fatec.bluds.api.infra.exceptions.general.UnauthorizedActionException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComentarioServiceImpl implements ComentarioService {

    private final ComentarioRepository repository;
    private final PublicacaoService publicacaoService;
    private final UsuarioService usuarioService;

    public ComentarioServiceImpl(ComentarioRepository repository, PublicacaoService publicacaoService, UsuarioService usuarioService) {
        this.repository = repository;
        this.publicacaoService = publicacaoService;
        this.usuarioService = usuarioService;
    }

    @Override
    public Comentario responderPublicacao(Long publicacaoId, CreateComentarioDTO dto) {
        Publicacao publicacao = publicacaoService.getPublicacaoById(publicacaoId);
        Usuario usuario = usuarioService.getAuthenticatedUser();

        Comentario comentario = new Comentario();
        comentario.setPublicacao(publicacao);
        comentario.setConteudo(dto.conteudo());
        comentario.setAutor(usuario);

        return repository.save(comentario);
    }

    @Override
    @Transactional
    public Comentario responderComentario(Long comentarioId, CreateComentarioDTO dto) {
        Comentario comentarioPai = this.getComentarioById(comentarioId);
        Comentario comentarioNovo = new Comentario();

        comentarioNovo.setComentarioPai(comentarioPai);
        comentarioNovo.setPublicacao(comentarioPai.getPublicacao());
        comentarioNovo.setAutor(usuarioService.getAuthenticatedUser());
        comentarioNovo.setConteudo(dto.conteudo());

        comentarioPai.getRespostas().add(comentarioNovo);

        repository.save(comentarioNovo);

        return repository.save(comentarioPai);
    }

    @Override
    public Comentario getComentarioById(Long comentarioId) {
        return repository.findById(comentarioId).orElseThrow(
                () -> new ComentarioNotFoundException("Comentário com o ID " + comentarioId + " não encontrado")
        );
    }

    @Override
    public List<Comentario> listarComentariosDePublicacao(Long publicacaoId) {
        return repository.findRootComentariosWithRespostasByPublicacaoIdAndComentarioPaiIsNull(publicacaoId);
    }

    @Transactional
    @Override
    public Comentario atualizarComentario(Long comentarioId, UpdateComentarioDTO dto) {
        Comentario comentario = this.getComentarioById(comentarioId);

        if (!usuarioService.getAuthenticatedUser().equals(comentario.getAutor())) {
            throw new UnauthorizedActionException("Somente o autor do comentário pode editá-lo");
        }

        Optional.of(dto.conteudo())
                .filter(conteudo -> !conteudo.isBlank())
                .ifPresent(comentario::setConteudo);

        return repository.save(comentario);
    }

    @Transactional
    @Override
    public void removerComentario(Long comentarioId) {
        Comentario comentario = this.getComentarioById(comentarioId);

        if (!usuarioService.getAuthenticatedUser().equals(comentario.getAutor())) {
            throw new UnauthorizedActionException("Somente o autor do comentário pode removê-lo");
        }

        repository.delete(comentario);
    }
}
