package com.fatec.bluds.api.domain.usuario.subclasses.estudante.controller;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteListDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteResponseDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteSummaryDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteUpdateDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.service.EstudanteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estudantes")
@Tag(name = "Módulo de Estudantes", description = "Gerencia as operações relacionadas à classe Estudante")
public class EstudanteController {

    @Autowired
    private EstudanteService service;

    /**
     * Atualiza os dados de um estudante existente.
     * Permite modificar informações como telefone, gênero e data de nascimento.
     */
    @Operation(summary = "Atualiza as informações de um Estudante", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estudante atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na validação dos dados enviados"),
            @ApiResponse(responseCode = "404", description = "Estudante não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<EstudanteResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid EstudanteUpdateDTO dto
    ) {
        Estudante atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(new EstudanteResponseDTO(atualizado));
    }

    /**
     * Retorna as informações completas de um estudante a partir do seu ID.
     */
    @Operation(summary = "Obtém um Estudante de acordo com seu ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estudante obtido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estudante não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<EstudanteSummaryDTO> buscarPorId(@PathVariable Long id) {
        var estudante = service.buscarPorId(id);
        return ResponseEntity.ok(estudante);
    }

    /**
     * Lista todos os estudantes cadastrados.
     * É possível aplicar filtros opcionais por ano escolar, período e nome.
     */
    @Operation(summary = "Lista Estudantes com filtros opcionais", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de estudantes obtida com sucesso"),
            @ApiResponse(responseCode = "404", description = "Nenhum estudante encontrado")
    })
    @GetMapping
    public ResponseEntity<List<EstudanteListDTO>> listar(
            @RequestParam(required = false) AnoEscolar anoEscolar,
            @RequestParam(required = false) Periodo periodo,
            @RequestParam(required = false) String nome
    ) {
        var estudantes = service.listar(anoEscolar, periodo, nome);
        return ResponseEntity.ok(estudantes);
    }

    /**
     * Remove um estudante do sistema.
     * Essa remoção é definitiva (delete físico).
     */
    @Operation(summary = "Remove um Estudante do sistema", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Estudante removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estudante não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }

}
