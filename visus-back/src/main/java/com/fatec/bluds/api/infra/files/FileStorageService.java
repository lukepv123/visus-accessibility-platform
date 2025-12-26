package com.fatec.bluds.api.infra.files;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads");

    private static final List<String> EXTENSOES_PERMITIDAS = List.of(
            "png", "jpeg", "jpg", "webp", "pdf", "docx", "pptx"
    );

    public FileStorageService() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório de upload!", e);
        }
    }

    public String armazenarArquivo(MultipartFile file, String disciplinaNome, String educadorNome) {
        validarArquivo(file);

        String extensao = getExtensao(file.getOriginalFilename());
        String nomeUnico = UUID.randomUUID() + "." + extensao;

        Path pastaDisciplina = rootLocation.resolve(sanitizar(disciplinaNome))
                .resolve(sanitizar(educadorNome));

        try {
            Files.createDirectories(pastaDisciplina);
            Path destino = pastaDisciplina.resolve(nomeUnico);
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return destino.toString();
        } catch (IOException e) {
            throw new RuntimeException("Erro ao armazenar arquivo: " + file.getOriginalFilename(), e);
        }
    }

    public Resource carregarArquivo(String caminho) {
        try {
            Path arquivo = Paths.get(caminho);
            Resource resource = new UrlResource(arquivo.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Não foi possível ler o arquivo: " + caminho);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erro ao carregar arquivo: " + caminho, e);
        }
    }

    public void deletarArquivo(String caminho) {
        try {
            Files.deleteIfExists(Paths.get(caminho));
        } catch (IOException e) {
            throw new RuntimeException("Erro ao deletar o arquivo físico: " + caminho, e);
        }
    }

    private void validarArquivo(MultipartFile file) {
        String extensao = getExtensao(file.getOriginalFilename());
        if (!EXTENSOES_PERMITIDAS.contains(extensao.toLowerCase())) {
            throw new IllegalArgumentException("Tipo de arquivo não permitido: " + extensao);
        }
    }

    private String getExtensao(String nomeArquivo) {
        return nomeArquivo.substring(nomeArquivo.lastIndexOf('.') + 1);
    }

    private String sanitizar(String valor) {
        return valor.replaceAll("[^a-zA-Z0-9-_]", "_");
    }
}
