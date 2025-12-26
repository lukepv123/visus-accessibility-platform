package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.dto.ArquivoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.resposta.model.Resposta;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema
public record RespostaDTO(
        Long id,
        String estudanteNome,
        Double nota,
        String comentarioEducador,
        ArquivoDTO arquivo,
        String conteudoTexto,
        LocalDateTime dataUpload
) {
    public RespostaDTO(Resposta resposta) {
        this(
                resposta.getId(),
                resposta.getAutor() != null ? resposta.getAutor().getNome() : null,
                resposta.getNota(),
                resposta.getComentario(),
                resposta.getArquivo() != null ? new ArquivoDTO(resposta.getArquivo()) : null,
                resposta.getConteudoTexto(),
                resposta.getDataUpload()
        );
    }
}
