package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto;

import com.fatec.bluds.api.domain.usuario.dto.UsuarioSummaryDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

@Schema
public record DisciplinaEstudantesDTO(
        List<UsuarioSummaryDTO> estudantes
) {
    public DisciplinaEstudantesDTO(ArrayList<Estudante> listaEstudantes) {
        this(listaEstudantes.stream().map(UsuarioSummaryDTO::new).toList());
    }
}