package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.controller;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.CreatePerfilAcessibilidadeDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.PerfilAcessibilidadeSummaryDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.UpdatePerfilAcessibilidadeDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.model.PerfilAcessibilidade;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.service.PerfilAcessibilidadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/acessibilidade")
@Tag(name = "Módulo Perfil de Acessibilidade", description = "Operações relacionadas ao Perfil de Acessibilidade atribuido a cada Estudante")
public class PerfilAcessibilidadeController {

    private final PerfilAcessibilidadeService service;

    public PerfilAcessibilidadeController(PerfilAcessibilidadeService service) {
        this.service = service;
    }

    @Operation(summary = "Cadastra um novo perfil de acessibilidade para um Estudante", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",  description = "Perfil de Acessibilidade registrado com sucesso"),
            @ApiResponse(responseCode = "400",  description = "Requisição tem parâmetros inválidos"),
            @ApiResponse(responseCode = "404",  description = "Estudante não encontrado")
    })
    @PostMapping("/estudante")
    public ResponseEntity<Object> createPerfilAcessibilidade(
            @RequestParam
            @Positive
            @NotNull
            Long estudanteId,
            @RequestBody
            @Valid
            CreatePerfilAcessibilidadeDTO dto,
            UriComponentsBuilder uriBuilder) {

        PerfilAcessibilidade perfilAcessibilidade = service.createPerfilAcessibilidade(estudanteId, dto);

        var uri = uriBuilder
                .path("/acessibilidade/{id}")
                .buildAndExpand(perfilAcessibilidade.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new PerfilAcessibilidadeSummaryDTO(perfilAcessibilidade));
    }

    @Operation(summary = "Busca um Perfil de Acessibilidade de acordo com seu ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "Perfil de Acessibilidade obtido com sucesso"),
            @ApiResponse(responseCode = "404",  description = "Perfil de Acessibilidade não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Object> getPerfilById(@PathVariable Long id) {
        PerfilAcessibilidade perfilAcessibilidade = service.getById(id);

        return ResponseEntity.ok().body(new PerfilAcessibilidadeSummaryDTO(perfilAcessibilidade));
    }

    @Operation(summary = "Busca um Perfil de Acessibilidade de acordo com seu Estudante", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "Perfil de Acessibilidade obtido com sucesso"),
            @ApiResponse(responseCode = "404",  description = "Perfil de Acessibilidade ou Estudante não encontrado")
    })
    @GetMapping("/estudante/{id}")
    public ResponseEntity<Object> getPerfilByEstudanteId(@PathVariable Long id) {
        PerfilAcessibilidade perfilAcessibilidade = service.getByEstudante(id);

        return ResponseEntity.ok().body(new PerfilAcessibilidadeSummaryDTO(perfilAcessibilidade));
    }

    @Operation(summary = "Atualiza um Perfil de Acessibilidade", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "Perfil de Acessibilidade atualizado com sucesso"),
            @ApiResponse(responseCode = "400",  description = "Requisição tem parâmetros inválidos"),
            @ApiResponse(responseCode = "404",  description = "Perfil de Acessibilidade não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePerfilAcessibilidade(@PathVariable Long id, @RequestBody UpdatePerfilAcessibilidadeDTO dto) {
        PerfilAcessibilidade perfilAcessibilidade = service.updatePerfilAcessibilidade(id, dto);

        return ResponseEntity.ok().body(new PerfilAcessibilidadeSummaryDTO(perfilAcessibilidade));
    }

    @Operation(summary = "Remove um Perfil de Acessibilidade", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",  description = "Perfil de Acessibilidade removido com sucesso"),
            @ApiResponse(responseCode = "404",  description = "Perfil de Acessibilidade não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> removePerfilAcessibilidade(@PathVariable Long id) {
        service.removePerfilAcessibilidade(id);

        return ResponseEntity.noContent().build();
    }
}
