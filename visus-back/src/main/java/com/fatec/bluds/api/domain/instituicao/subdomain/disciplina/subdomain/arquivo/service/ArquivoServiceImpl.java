package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.repository.DisciplinaRepository;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.dto.ArquivoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.model.Arquivo;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.repository.ArquivoRepository;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.domain.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ArquivoServiceImpl implements ArquivoService {

    private final ArquivoRepository arquivoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;
    private final Path raizUploads;

    public ArquivoServiceImpl(
            ArquivoRepository arquivoRepository,
            DisciplinaRepository disciplinaRepository,
            UsuarioRepository usuarioRepository,
            @Value("${file.upload-dir:uploads}") String uploadDir
    ) {
        this.arquivoRepository = arquivoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.usuarioRepository = usuarioRepository;
        this.raizUploads = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(raizUploads);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar o diretório de uploads", e);
        }
    }

    @Override
    public ArquivoDTO upload(Long disciplinaId, MultipartFile arquivo, String descricao, Long usuarioId) throws IOException {
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new IllegalArgumentException("Disciplina não encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Path pastaDisciplina = raizUploads.resolve("disciplina_" + disciplinaId);
        Files.createDirectories(pastaDisciplina);

        Path caminhoArquivo = pastaDisciplina.resolve(arquivo.getOriginalFilename());
        Files.copy(arquivo.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);

        Arquivo novo = new Arquivo();
        novo.setNomeOriginal(arquivo.getOriginalFilename());
        novo.setCaminho(caminhoArquivo.toString());
        novo.setTipoMime(arquivo.getContentType());
        novo.setDataEnvio(LocalDateTime.now());
        novo.setEnviadoPor(usuario);
        novo.setDisciplina(disciplina);
        novo.setDescricao(descricao);

        Arquivo salvo = arquivoRepository.save(novo);

        return new ArquivoDTO(salvo);
    }

    @Override
    public Resource download(Long arquivoId) throws MalformedURLException {
        Arquivo arquivo = arquivoRepository.findById(arquivoId)
                .orElseThrow(() -> new IllegalArgumentException("Arquivo não encontrado"));

        Path caminho = Paths.get(arquivo.getCaminho());
        Resource recurso = new UrlResource(caminho.toUri());

        if (!recurso.exists() || !recurso.isReadable()) {
            throw new RuntimeException("Não foi possível ler o arquivo: " + arquivo.getNomeOriginal());
        }

        return recurso;
    }

    @Override
    public List<ArquivoDTO> listarArquivos(Long disciplinaId) {
        return arquivoRepository.findByDisciplinaId(disciplinaId)
                .stream().map(ArquivoDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public void deletar(Long arquivoId, Long usuarioId, boolean isEducador) {
        Arquivo arquivo = arquivoRepository.findById(arquivoId)
                .orElseThrow(() -> new IllegalArgumentException("Arquivo não encontrado"));

        if (!isEducador && !arquivo.getEnviadoPor().getId().equals(usuarioId)) {
            throw new SecurityException("Você não tem permissão para deletar este arquivo.");
        }

        try {
            Files.deleteIfExists(Paths.get(arquivo.getCaminho()));
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar arquivo físico.", e);
        }

        arquivoRepository.delete(arquivo);
    }

    @Override
    public String salvar(MultipartFile arquivo, String subpasta) {
        try {
            Path pastaDestino = raizUploads.resolve(subpasta);
            Files.createDirectories(pastaDestino);

            Path caminhoArquivo = pastaDestino.resolve(arquivo.getOriginalFilename());
            Files.copy(arquivo.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);

            return caminhoArquivo.toString(); // retorna o caminho absoluto salvo
        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar arquivo: " + arquivo.getOriginalFilename(), e);
        }
    }

}
