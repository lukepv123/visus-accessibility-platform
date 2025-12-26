package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.service;

import com.fatec.bluds.api.domain.instituicao.model.InstituicaoEnsino;
import com.fatec.bluds.api.domain.instituicao.service.InstituicaoService;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto.*;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.repository.DisciplinaRepository;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Educador;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.service.EducadorService;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.service.EstudanteService;
import com.fatec.bluds.api.infra.exceptions.disciplina.DisciplinaNotFoundException;
import com.fatec.bluds.api.infra.exceptions.instituicao.InstituicaoNotFoundException;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplinaServiceImpl implements DisciplinaService{

    private final DisciplinaRepository disciplinaRepository;

    private final EducadorService educadorService;

    private final EstudanteService estudanteService;

    private final InstituicaoService instituicaoService;

    public DisciplinaServiceImpl(DisciplinaRepository disciplinaRepository,
                                 EducadorService educadorService,
                                 EstudanteService estudanteService,
                                 InstituicaoService instituicaoService) {
        this.disciplinaRepository = disciplinaRepository;
        this.educadorService = educadorService;
        this.estudanteService = estudanteService;
        this.instituicaoService = instituicaoService;
    }

    @Override
    public Disciplina createDisciplina(CreateDisciplinaDTO dto) {
        InstituicaoEnsino instituicaoEnsino = instituicaoService.getInstituicaoById(dto.idInstituicao());
        Educador educador = educadorService.findById(dto.idEducadorResponsavel());

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(dto.nome());
        disciplina.setDescricao(dto.descricao());
        disciplina.setEducador(educador);
        disciplina.setInstituicaoEnsino(instituicaoEnsino);

        return disciplinaRepository.save(disciplina);
    }

    @Override
    public Disciplina getDisciplinaById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID da Disciplina não pode ser nulo ou inferior a 1");
        }

        return disciplinaRepository.findById(id).orElseThrow(
                () -> new DisciplinaNotFoundException("Disciplina com ID " + id + " não encontrada")
        );
    }

    @Override
    public List<Disciplina> getDisciplinasByEstudante(Long estudanteId) {
        if (!estudanteService.existsById(estudanteId)) {
            throw new UsuarioNotFoundException("Estudante com ID " + estudanteId + " não encontrado");
        }

        return disciplinaRepository.findByEstudanteId(estudanteId);
    }

    @Override
    public List<Disciplina> getDisciplinasByInstituicao(Long instituicaoId) {
        if (!instituicaoService.instituicaoExists(instituicaoId)) {
            throw new InstituicaoNotFoundException("Instituição de Ensino com o ID " + instituicaoId + " não encontrada");
        }

        return disciplinaRepository.findByInstituicaoEnsinoId(instituicaoId);
    }

    @Override
    public List<Disciplina> getDisciplinasByEducador(Long educadorId) {
        if (!educadorService.existsById(educadorId)) {
            throw new UsuarioNotFoundException("Educador com ID " + educadorId + " não encontrado");
        }

        return disciplinaRepository.findByEducadorId(educadorId);
    }

    @Transactional
    @Override
    public Disciplina updateDisciplina(Long id, UpdateDisciplinaDTO dto) {
        Disciplina disciplina = this.getDisciplinaById(id);

        if (dto.nome() != null && !dto.nome().isBlank()) {
            disciplina.setNome(dto.nome());
        }

        if (dto.descricao() != null && !dto.descricao().isBlank()) {
            disciplina.setDescricao(dto.descricao());
        }

        if (dto.idEducadorResponsavel() != null && dto.idEducadorResponsavel() > 0) {
            Educador educador = educadorService.findById(dto.idEducadorResponsavel());
            disciplina.setEducador(educador);
        }

        return disciplinaRepository.save(disciplina);
    }

    @Override
    public List<Estudante> getEstudantesFromDisciplina(Long id) {
        if (!disciplinaRepository.existsById(id)) {
            throw new DisciplinaNotFoundException("Disciplina com o ID " + id + " não foi encontrada");
        };

        return disciplinaRepository.findEstudantesByDisciplinaId(id);
    }

    @Override
    public List<Estudante> addEstudanteToDisciplina(Long disciplinaId, Long estudanteId) {
        Disciplina disciplina = this.getDisciplinaById(disciplinaId);
        Estudante estudante = estudanteService.getEstudanteById(estudanteId);

        if (disciplina.getEstudantes().contains(estudante)) {
            throw new IllegalStateException("O estudante já está matriculado nesta disciplina.");
        }

        disciplina.getEstudantes().add(estudante);
        estudante.getDisciplinas().add(disciplina);

        disciplinaRepository.save(disciplina);

        return disciplina.getEstudantes().stream().toList();
    }

    @Override
    public List<Estudante> removeEstudanteFromDisciplina(Long disciplinaId, Long estudanteId) {
        Disciplina disciplina = this.getDisciplinaById(disciplinaId);
        Estudante estudante = estudanteService.getEstudanteById(estudanteId);

        if (!disciplina.getEstudantes().contains(estudante)) {
            throw new IllegalArgumentException("O Estudante não está matriculado nesta disciplina");
        }

        disciplina.getEstudantes().remove(estudante);
        estudante.getDisciplinas().remove(disciplina);

        disciplinaRepository.save(disciplina);

        return disciplina.getEstudantes().stream().toList();
    }

    @Override
    public List<Estudante> enrollByBulk(EstudantesByBulkDTO dto) {
        return null;
    }

    @Override
    public List<Estudante> unenrollByBulk(EstudantesByBulkDTO dto) {
        return null;
    }
}
