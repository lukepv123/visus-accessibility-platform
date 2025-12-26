package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.repository.DisciplinaRepository;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.CreateTarefaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.UpdateTarefaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.model.Tarefa;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.repository.TarefaRepository;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Educador;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.repository.EducadorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TarefaServiceImpl implements TarefaService {

    private final TarefaRepository tarefaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final EducadorRepository educadorRepository;

    public TarefaServiceImpl(
            TarefaRepository tarefaRepository,
            DisciplinaRepository disciplinaRepository,
            EducadorRepository educadorRepository
    ) {
        this.tarefaRepository = tarefaRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.educadorRepository = educadorRepository;
    }

    @Override
    @Transactional
    public Tarefa createTarefa(CreateTarefaDTO dto) {
        Disciplina disciplina = disciplinaRepository.findById(dto.disciplinaId())
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada para o ID informado"));

        Educador autor = educadorRepository.findById(dto.autorId())
                .orElseThrow(() -> new EntityNotFoundException("Educador não encontrado para o ID informado"));

        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(dto.titulo());
        tarefa.setConteudo(dto.conteudo());
        tarefa.setDataExpiracao(dto.dataExpiracao());
        tarefa.setValorTotal(dto.valorTotal());
        tarefa.setDisciplina(disciplina);
        tarefa.setAutor(autor);

        return tarefaRepository.save(tarefa);
    }

    @Override
    public Tarefa getTarefaById(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tarefa não encontrada"));
    }

    @Override
    public List<Tarefa> getTarefasByDisciplina(Long disciplinaId) {
        return tarefaRepository.findByDisciplinaId(disciplinaId);
    }

    @Override
    @Transactional
    public Tarefa updateTarefa(Long tarefaId, UpdateTarefaDTO dto) {
        Tarefa tarefa = getTarefaById(tarefaId);

        if (dto.titulo() != null) tarefa.setTitulo(dto.titulo());
        if (dto.conteudo() != null) tarefa.setConteudo(dto.conteudo());
        if (dto.dataExpiracao() != null) tarefa.setDataExpiracao(dto.dataExpiracao());
        if (dto.valorTotal() != null) tarefa.setValorTotal(dto.valorTotal());

        return tarefaRepository.save(tarefa);
    }

    @Override
    @Transactional
    public void removeTarefa(Long id) {
        Tarefa tarefa = getTarefaById(id);
        tarefaRepository.delete(tarefa);
    }
}
