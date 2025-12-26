package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.CreateTarefaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.UpdateTarefaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.model.Tarefa;

import java.util.List;

public interface TarefaService {
    Tarefa createTarefa(CreateTarefaDTO dto);
    Tarefa getTarefaById(Long id);
    List<Tarefa> getTarefasByDisciplina(Long disciplinaId);
    Tarefa updateTarefa(Long tarefaId, UpdateTarefaDTO dto);
    void removeTarefa(Long id);
}
