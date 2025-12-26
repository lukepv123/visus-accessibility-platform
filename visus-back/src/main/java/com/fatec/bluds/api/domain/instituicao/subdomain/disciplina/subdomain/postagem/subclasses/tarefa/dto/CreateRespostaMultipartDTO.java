package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

/**
 * DTO para criação de uma resposta de tarefa com upload de arquivo.
 * Usa record para gerar automaticamente os getters (tarefaId(), conteudoTexto(), arquivo()).
 */
@Schema
public record CreateRespostaMultipartDTO(
        Long tarefaId,
        String conteudoTexto,
        MultipartFile arquivo
) {}
