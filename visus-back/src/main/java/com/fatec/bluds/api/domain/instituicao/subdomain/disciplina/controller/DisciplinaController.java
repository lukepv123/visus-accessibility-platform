package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.controller;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto.*;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.service.DisciplinaService;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteSummaryDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
@Tag(name = "Módulo Disciplinas", description = "Responsável por operações relacionadas a Disciplinas dentro de uma Instiuição de Ensino")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @Operation(summary = "Cria uma Disciplina", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Disciplina criada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Instituição de Ensino ou Educador não encontrados"),
            @ApiResponse(responseCode = "409", description = "Dados inválidos ou conflitantes")
    })
    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<DisciplinaSummaryDTO> createDisciplina(@RequestBody @Valid CreateDisciplinaDTO dto, UriComponentsBuilder uriBuilder) {

        Disciplina disciplina = disciplinaService.createDisciplina(dto);

        var uri = uriBuilder
                .path("/disciplinas/{id}")
                .buildAndExpand(disciplina.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new DisciplinaSummaryDTO(disciplina));
    }

    @Operation(summary = "Obtém uma Disciplina através do seu ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Disciplina obtida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Disciplina não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaSummaryDTO> getDisciplinaById(@PathVariable Long id) {
        return ResponseEntity.ok(new DisciplinaSummaryDTO(disciplinaService.getDisciplinaById(id)));
    }

    @Operation(summary = "Obtém as Disciplinas nas quais um estudante está matriculado", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Disciplinas obtidas com sucesso"),
            @ApiResponse(responseCode = "204", description = "O estudante não está matriculado em nenhuma disciplina"),
            @ApiResponse(responseCode = "404", description = "Estudante não encontrado")
    })
    @GetMapping("/estudante")
    public ResponseEntity<List<DisciplinaSummaryDTO>> getDisciplinasByEstudante(
            @RequestParam
            @NotNull(message = "ID do Estudante não pode ser nulo")
            @Positive(message = "ID do  Estudante não pode ser negativo ou zero")
            Long estudanteId
    ) {

        List<Disciplina> disciplinas = disciplinaService.getDisciplinasByEstudante(estudanteId);

        return disciplinas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(
                disciplinas.stream().map(DisciplinaSummaryDTO::new).toList()
        );
    }

    @Operation(summary = "Obtém as Disciplinas cadastradas em uma determinada Instituição de Ensino", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Disciplinas obtidas com sucesso"),
            @ApiResponse(responseCode = "204", description = "A Instituição de Ensino não tem nenhuma Disciplina cadastrada"),
            @ApiResponse(responseCode = "404", description = "Instituição de Ensino não encontrada")
    })
    @GetMapping("/instituicao")
    public ResponseEntity<List<DisciplinaSummaryDTO>> getDisciplinasByInstituicao(
            @RequestParam
            @NotNull(message = "ID da Instituição de Ensino não pode ser nulo")
            @Positive(message = "ID da Instituição de Ensino deve ser um número positivo maior que zero")
            Long instituicaoId
    ) {
        List<Disciplina> disciplinas = disciplinaService.getDisciplinasByInstituicao(instituicaoId);

        return disciplinas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(
                disciplinas.stream().map(DisciplinaSummaryDTO::new).toList()
        );
    }

    @Operation(summary = "Obtém as Disciplinas ministradas por um Educador", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Disciplinas obtidas com sucesso"),
            @ApiResponse(responseCode = "204", description = "O Educador não ministra nenhuma Disciplina"),
            @ApiResponse(responseCode = "204", description = "Educador não encontrado")
    })
    @GetMapping("/educador")
    public ResponseEntity<List<DisciplinaSummaryDTO>> getDisciplinasByEducador(
        @RequestParam
        @NotNull(message = "ID do Educador não pode ser nulo")
        @Positive(message = "ID do Educador deve ser um número positivo maior que zero")
        Long educadorId
    ) {
        List<Disciplina> disciplinas = disciplinaService.getDisciplinasByEducador(educadorId);

        return disciplinas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(
                disciplinas.stream().map(DisciplinaSummaryDTO::new).toList()
        );
    }


    @Operation(summary = "Atualiza as informações de uma Disciplina", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Disciplina atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Disciplina ou Educador responsável não encontrados"),
            @ApiResponse(responseCode = "409", description = "Dados inválidos ou conflitantes")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<DisciplinaSummaryDTO> updateDisciplina(@PathVariable Long id, @RequestBody @Valid UpdateDisciplinaDTO dto) {
        DisciplinaSummaryDTO disciplinaSummary = new DisciplinaSummaryDTO(disciplinaService.updateDisciplina(id, dto));

        return ResponseEntity.ok(disciplinaSummary);
    }

    @Operation(summary = "Obtém os Estudantes matriculados em uma Instituição de Ensino", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estudantes obtidos com sucesso"),
            @ApiResponse(responseCode = "204", description = "Nenhum Estudante está matriculado nesta Disciplina"),
            @ApiResponse(responseCode = "404", description = "Disciplina não encontrada")
    })
    @GetMapping("/{id}/estudantes")
    public ResponseEntity<List<EstudanteSummaryDTO>> getEstudantesFromDisciplina(
            @PathVariable
            @NotNull(message = "ID da disciplina não pode ser nulo")
            @Positive(message = "ID da disciplina deve ser um número positivo maior que zero")
            Long id
    ) {
        List<Estudante> estudantes = disciplinaService.getEstudantesFromDisciplina(id);

        return estudantes.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(
                estudantes.stream().map(EstudanteSummaryDTO::new).toList()
        );
    }

    @Operation(summary = "Adiciona um Estudante a uma Disciplina", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estudante adicionado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estudante ou Disciplina não encontrados")
    })
    @PostMapping("/{id}/estudantes")
    public ResponseEntity<List<EstudanteSummaryDTO>> addEstudanteToDisciplina(
            @PathVariable
            @NotNull(message = "ID da disciplina não pode ser nulo")
            @Positive(message = "ID da disciplina deve ser um número positivo maior que zero")
            Long id,
            @RequestParam
            @NotNull(message = "ID do Estudante não pode ser nulo")
            @Positive(message = "ID do Estudante deve ser um número positivo maior que zero")
            Long estudanteId
    ) {
        List<Estudante> estudantes = disciplinaService.addEstudanteToDisciplina(id, estudanteId);

        return ResponseEntity.ok(estudantes.stream().map(EstudanteSummaryDTO::new).toList());
    }

    @Operation(summary = "Adiciona um Estudante a uma Disciplina", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estudante removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estudante ou Disciplina não encontrados")
    })
    @DeleteMapping("/{id}/estudantes")
    public ResponseEntity<List<EstudanteSummaryDTO>> removeEstudanteToDisciplina(
            @PathVariable
            @NotNull(message = "ID da disciplina não pode ser nulo")
            @Positive(message = "ID da disciplina deve ser um número positivo maior que zero")
            Long id,
            @RequestParam
            @NotNull(message = "ID do Estudante não pode ser nulo")
            @Positive(message = "ID do Estudante deve ser um número positivo maior que zero")
            Long estudanteId
    ) {
        List<Estudante> estudantes = disciplinaService.removeEstudanteFromDisciplina(id, estudanteId);

        return ResponseEntity.ok(estudantes.stream().map(EstudanteSummaryDTO::new).toList());
    }


}
