package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.dto.ArquivoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.model.Arquivo;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.service.ArquivoService;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.AvaliarRespostaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.CreateRespostaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.CreateRespostaMultipartDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.repository.RespostaRepository;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.repository.TarefaRepository;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.resposta.model.Resposta;
import com.fatec.bluds.api.domain.usuario.service.UsuarioService;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.repository.EstudanteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class RespostaServiceImpl implements RespostaService {

    private final TarefaRepository tarefaRepository;
    private final EstudanteRepository estudanteRepository;
    private final RespostaRepository respostaRepository;
    private final ArquivoService arquivoService;
    private final UsuarioService usuarioService;

    public RespostaServiceImpl(
            TarefaRepository tarefaRepository,
            EstudanteRepository estudanteRepository,
            RespostaRepository respostaRepository,
            ArquivoService arquivoService,
            UsuarioService usuarioService
    ) {
        this.tarefaRepository = tarefaRepository;
        this.estudanteRepository = estudanteRepository;
        this.respostaRepository = respostaRepository;
        this.arquivoService = arquivoService;
        this.usuarioService = usuarioService;
    }

    @Override
    @Transactional
    public Resposta enviarResposta(CreateRespostaDTO dto) {
        var tarefa = tarefaRepository.findById(dto.tarefaId())
                .orElseThrow(() -> new EntityNotFoundException("Tarefa não encontrada"));
        var estudante = estudanteRepository.findById(dto.estudanteId())
                .orElseThrow(() -> new EntityNotFoundException("Estudante não encontrado"));

        Resposta resposta = new Resposta();
        resposta.setTarefa(tarefa);
        resposta.setAutor(estudante);
        resposta.setConteudoTexto(dto.conteudoTexto());
        resposta.setDataUpload(LocalDateTime.now());

        return respostaRepository.save(resposta);
    }

    @Transactional
    public Resposta enviarRespostaComArquivo(Long tarefaId, Long estudanteId, MultipartFile arquivo, String conteudoTexto) throws IOException {
        var tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new EntityNotFoundException("Tarefa não encontrada"));
        var estudante = estudanteRepository.findById(estudanteId)
                .orElseThrow(() -> new EntityNotFoundException("Estudante não encontrado"));

        // Upload do arquivo no contexto da disciplina da tarefa
        ArquivoDTO arquivoSalvo = arquivoService.upload(
                tarefa.getDisciplina().getId(),
                arquivo,
                "Resposta de tarefa: " + tarefa.getTitulo(),
                estudanteId
        );

        // Monta resposta
        Resposta resposta = new Resposta();
        resposta.setTarefa(tarefa);
        resposta.setAutor(estudante);
        resposta.setConteudoTexto(conteudoTexto);
        resposta.setDataUpload(LocalDateTime.now());

        // Associa o arquivo salvo
        Arquivo arquivoEntidade = new Arquivo();
        arquivoEntidade.setId(arquivoSalvo.id());
        resposta.setArquivo(arquivoEntidade);

        return respostaRepository.save(resposta);
    }

    @Override
    @Transactional
    public Resposta avaliarResposta(Long respostaId, AvaliarRespostaDTO dto) {
        var resposta = respostaRepository.findById(respostaId)
                .orElseThrow(() -> new EntityNotFoundException("Resposta não encontrada"));

        resposta.setNota(dto.nota());
        resposta.setComentario(dto.comentario());

        return respostaRepository.save(resposta);
    }

    @Transactional
    public Resposta criarRespostaComUpload(CreateRespostaMultipartDTO dto) {
        var usuario = usuarioService.getAuthenticatedUser();
        var tarefa = tarefaRepository.findById(dto.tarefaId())
                .orElseThrow(() -> new EntityNotFoundException("Tarefa não encontrada"));

        // Verifica se o estudante já respondeu esta tarefa
        if (respostaRepository.existsByTarefaIdAndAutorId(tarefa.getId(), usuario.getId())) {
            throw new IllegalStateException("Você já enviou uma resposta para esta tarefa.");
        }

        // Salvar o arquivo (caso enviado)
        String caminhoAnexo = null;
        if (dto.arquivo() != null && !dto.arquivo().isEmpty()) {
            caminhoAnexo = arquivoService.salvar(dto.arquivo(), "respostas");
        }

        var resposta = new Resposta();
        resposta.setAutor(usuario);
        resposta.setTarefa(tarefa);
        resposta.setConteudoTexto(dto.conteudoTexto());
        resposta.setCaminhoAnexo(caminhoAnexo);
        resposta.setDataUpload(LocalDateTime.now());

        return respostaRepository.save(resposta);
    }
}
