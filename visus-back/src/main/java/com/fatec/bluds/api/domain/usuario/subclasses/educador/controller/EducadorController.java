package com.fatec.bluds.api.domain.usuario.subclasses.educador.controller;

import com.fatec.bluds.api.domain.usuario.subclasses.educador.dto.*;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.service.EducadorService;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/educadores")
@Tag(name = "👨‍🏫 Educadores", description = "Gestão de educadores e suas formações acadêmicas")
public class EducadorController {

    @Autowired
    private EducadorService educadorService;

    //  Buscar Educador por ID
    @Operation(summary = "Buscar Educador por ID")
    @GetMapping("/{id}")
    public ResponseEntity<EducadorResponseDTO> getEducador(@PathVariable Long id) {
        return educadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new UsuarioNotFoundException("Educador não encontrado."));
    }

    @Operation(summary = "Atualiza um Educador")
    @ApiResponse(responseCode = "200", description = "Atualização realizada com sucesso")
    @ApiResponse(responseCode = "404", description = "Educador não encontrado")
    @ApiResponse(responseCode = "409", description = "Dados conflitantes ou inválidos")
    @PutMapping("/{id}")
    public ResponseEntity<EducadorSummaryDTO> updateEducador(@PathVariable Long id, @RequestBody UpdateEducadorDTO dto) {
        return ResponseEntity.ok(new EducadorSummaryDTO(educadorService.updateEducador(id, dto)));
    }

    //  Adicionar Formacao
    @Operation(summary = "Adicionar nova formação ao educador")
    @ApiResponse(responseCode = "200", description = "Formação adicionada com sucesso")
    @PostMapping("/{id}/formacoes")
    public ResponseEntity<EducadorResponseDTO> adicionarFormacao(
            @PathVariable Long id,
            @RequestBody FormacaoRequestDTO dto) {

        EducadorResponseDTO educadorAtualizado = educadorService.adicionarFormacao(id, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/formacoes")
    public ResponseEntity<FormacaoListResponseDTO> listarFormacoes(@PathVariable Long id) {
        List<FormacaoResponseDTO> formacoes = educadorService.listarFormacoes(id);
        return ResponseEntity.ok(new FormacaoListResponseDTO(formacoes, formacoes.size()));
    }

    // ️ Remover Formaaoo
    @Operation(summary = "Remover formação do educador")
    @ApiResponse(responseCode = "204", description = "Formação removida com sucesso")
    @DeleteMapping("/{id}/formacoes/{formacaoId}")
    public ResponseEntity<Void> removerFormacao(
            @PathVariable Long id,
            @PathVariable Long formacaoId) {
        educadorService.removerFormacao(formacaoId);
        return ResponseEntity.noContent().build();
    }
}
