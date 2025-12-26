package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.controller;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.ComentarioSummaryDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.CreateComentarioDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto.UpdateComentarioDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.model.Comentario;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.service.ComentarioService;
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

import java.util.List;

@RestController
@RequestMapping("/comentarios")
@Tag(name = "Módulo Comentários", description = "Responsável por operações relacionadas a Comentários dentro de uma Publicação")
public class ComentarioController {

    private final ComentarioService service;

    public ComentarioController(ComentarioService service) {
        this.service = service;
    }

    @Operation(summary = "Adiciona um comentário a uma Publicação", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Comentário criado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Publicação ou Usuário Autenticado não encontrados"),
            @ApiResponse(responseCode = "409", description = "Dados inválidos ou conflitantes")
    })
    @PostMapping("/responder/publicacao")
    public ResponseEntity<ComentarioSummaryDTO> responderPublicacao(
            @RequestParam
            @NotNull
            @Positive
            Long publicacaoId,
            @RequestBody
            @Valid
            CreateComentarioDTO dto,
            UriComponentsBuilder uriBuilder
    ) {
        Comentario comentario = service.responderPublicacao(publicacaoId, dto);

        var uri = uriBuilder
                .path("/comentarios/{id}")
                .buildAndExpand(comentario.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new ComentarioSummaryDTO(comentario));
    }

    @Operation(summary = "Responde um comentário em uma Publicação", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentário criado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário, Publicação ou Usuário Autenticado não encontrados"),
            @ApiResponse(responseCode = "409", description = "Dados inválidos ou conflitantes")
    })
    @PostMapping("/responder/comentario")
    public ResponseEntity<ComentarioSummaryDTO> responderComentario(
            @RequestParam
            @NotNull
            @Positive
            Long comentarioId,
            @RequestBody
            @Valid
            CreateComentarioDTO dto
    ) {
        Comentario comentario = service.responderComentario(comentarioId, dto);

        return ResponseEntity.ok(new ComentarioSummaryDTO(comentario));
    }

    @Operation(summary = "Busca um comentário com base no seu ID", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentário obtido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ComentarioSummaryDTO> getComentarioById(@PathVariable Long id) {
        Comentario comentario = service.getComentarioById(id);

        return ResponseEntity.ok(new ComentarioSummaryDTO(comentario));
    }

    @Operation(summary = "Busca comentários-pai de uma Publicação", method = "GET")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentário obtidos com sucesso"),
            @ApiResponse(responseCode = "204", description = "Publicação não possui comentários"),
            @ApiResponse(responseCode = "404", description = "Publicação não encontrada")
    })
    @GetMapping("/publicacao")
    public ResponseEntity<List<ComentarioSummaryDTO>> obterComentariosDaPublicacao(
            @RequestParam
            @NotNull
            @Positive
            Long publicacaoId
    ) {
        List<Comentario> comentarios = service.listarComentariosDePublicacao(publicacaoId);

        return comentarios.isEmpty() ?
                ResponseEntity.noContent().build() :
                ResponseEntity.ok(comentarios.stream().map(ComentarioSummaryDTO::new).toList());
    }

    @Operation(summary = "Atualiza um comentário", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comentário atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ComentarioSummaryDTO> atualizarComentario(@PathVariable Long id, @RequestBody UpdateComentarioDTO dto) {
        Comentario comentario = service.atualizarComentario(id, dto);

        return ResponseEntity.ok(new ComentarioSummaryDTO(comentario));
    }

    @Operation(summary = "Atualiza um comentário", method = "DELETE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Comentário removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Comentário não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> removerComentario(@PathVariable Long id) {
        service.removerComentario(id);

        return ResponseEntity.noContent().build();
    }
}
