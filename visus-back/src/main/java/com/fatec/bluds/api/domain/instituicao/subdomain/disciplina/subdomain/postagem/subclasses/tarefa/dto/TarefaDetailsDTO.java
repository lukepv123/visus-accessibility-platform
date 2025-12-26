package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.model.Tarefa;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema
public record TarefaDetailsDTO(
        Long id,
        String titulo,
        String conteudo,
        LocalDateTime dataEnvio,
        LocalDateTime dataExpiracao,
        Double valorTotal,
        Boolean permitirArquivoResposta,
        String disciplinaNome,
        String autorNome,
        List<RespostaDTO> respostas
) {
    public TarefaDetailsDTO(Tarefa tarefa) {
        this(
                tarefa.getId(),
                tarefa.getTitulo(),
                tarefa.getConteudo(),
                tarefa.getDataEnvio(),
                tarefa.getDataExpiracao(),
                tarefa.getValorTotal(),
                tarefa.getPermitirArquivoResposta(),
                tarefa.getDisciplina() != null ? tarefa.getDisciplina().getNome() : null,
                tarefa.getAutor() != null ? tarefa.getAutor().getNome() : null,
                tarefa.getRespostas() != null
                        ? tarefa.getRespostas().stream().map(RespostaDTO::new).toList()
                        : List.of()
        );
    }
}
