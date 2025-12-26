package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto.*;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;

import java.util.List;

public interface DisciplinaService {
    Disciplina createDisciplina(CreateDisciplinaDTO dto);
    Disciplina getDisciplinaById(Long id);
    List<Disciplina> getDisciplinasByEstudante(Long estudanteId);
    List<Disciplina> getDisciplinasByInstituicao(Long instituicaoId);
    List<Disciplina> getDisciplinasByEducador(Long educadorId);
    Disciplina updateDisciplina(Long id,UpdateDisciplinaDTO dto);
    List<Estudante> getEstudantesFromDisciplina(Long id);
    List<Estudante> addEstudanteToDisciplina(Long disciplinaId, Long estudanteId);
    List<Estudante> removeEstudanteFromDisciplina(Long disciplinaId, Long estudanteId);
    List<Estudante> enrollByBulk(EstudantesByBulkDTO dto);
    List<Estudante> unenrollByBulk(EstudantesByBulkDTO dto);
}
