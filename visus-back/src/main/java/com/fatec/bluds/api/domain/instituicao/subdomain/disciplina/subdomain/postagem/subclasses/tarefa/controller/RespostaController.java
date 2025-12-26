package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.controller;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.AvaliarRespostaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.CreateRespostaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.CreateRespostaMultipartDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.dto.RespostaDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.service.RespostaServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Respostas", description = "Gerenciamento das respostas das tarefas")
@RestController
@RequestMapping("/respostas")
public class RespostaController {

    private final RespostaServiceImpl respostaService;

    public RespostaController(RespostaServiceImpl respostaService) {
        this.respostaService = respostaService;
    }

    // --- Criação simples de resposta (sem upload) ---
    @Operation(summary = "Cria uma nova resposta de texto para uma tarefa")
    @PostMapping
    @PreAuthorize("hasRole('ESTUDANTE')")
    public ResponseEntity<RespostaDTO> enviarResposta(@RequestBody CreateRespostaDTO dto) {
        var resposta = respostaService.enviarResposta(dto);
        return ResponseEntity.ok(new RespostaDTO(resposta));
    }

    // --- Criação de resposta com upload ---
    @Operation(summary = "Cria uma nova resposta com upload de arquivo")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ESTUDANTE')")
    public ResponseEntity<RespostaDTO> criarRespostaComUpload(
            @ModelAttribute CreateRespostaMultipartDTO dto
    ) {
        var resposta = respostaService.criarRespostaComUpload(dto);
        return ResponseEntity.ok(new RespostaDTO(resposta));
    }

    // --- Avaliar resposta (professor) ---
    @Operation(summary = "Avalia uma resposta enviada por um estudante")
    @PatchMapping("/{id}/avaliar")
    @PreAuthorize("hasRole('EDUCADOR')")
    public ResponseEntity<RespostaDTO> avaliarResposta(
            @PathVariable Long id,
            @RequestBody AvaliarRespostaDTO dto
    ) {
        var resposta = respostaService.avaliarResposta(id, dto);
        return ResponseEntity.ok(new RespostaDTO(resposta));
    }
}
