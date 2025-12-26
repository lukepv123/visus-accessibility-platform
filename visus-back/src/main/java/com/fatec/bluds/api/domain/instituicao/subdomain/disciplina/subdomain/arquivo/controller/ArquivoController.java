package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.controller;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.dto.ArquivoDTO;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.service.ArquivoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/arquivos")
public class ArquivoController {

    private final ArquivoService arquivoService;

    public ArquivoController(ArquivoService arquivoService) {
        this.arquivoService = arquivoService;
    }

    @Operation(summary = "Faz upload de um arquivo para uma disciplina", method = "POST")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Arquivo enviado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Disciplina ou Educador não encontrados"),
            @ApiResponse(responseCode = "400", description = "Falha ao enviar o arquivo")
    })
    @PostMapping("/upload/{disciplinaId}")
    public ResponseEntity<ArquivoDTO> uploadArquivo(
            @PathVariable
            @NotNull(message = "ID da disciplina é obrigatório")
            @Positive(message = "ID da disciplina deve ser positivo")
            Long disciplinaId,
            @RequestParam("arquivo") MultipartFile arquivo,
            @RequestParam(value = "descricao", required = false) String descricao,
            @RequestParam("usuarioId") Long usuarioId
    ) throws IOException {

        ArquivoDTO dto = arquivoService.upload(disciplinaId, arquivo, descricao, usuarioId);
        return ResponseEntity.status(201).body(dto);
    }

    @Operation(summary = "Lista todos os arquivos de uma disciplina", method = "GET")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Arquivos listados com sucesso"),
            @ApiResponse(responseCode = "204", description = "Nenhum arquivo encontrado")
    })
    @GetMapping("/disciplina/{disciplinaId}")
    public ResponseEntity<List<ArquivoDTO>> listarArquivos(
            @PathVariable
            @NotNull @Positive Long disciplinaId
    ) {
        List<ArquivoDTO> arquivos = arquivoService.listarArquivos(disciplinaId);
        if (arquivos.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(arquivos);
    }

    @Operation(summary = "Baixa um arquivo pelo ID", method = "GET")
    @GetMapping("/download/{arquivoId}")
    public ResponseEntity<Resource> downloadArquivo(
            @PathVariable Long arquivoId
    ) throws MalformedURLException {
        Resource recurso = arquivoService.download(arquivoId);

        // Força o download
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + recurso.getFilename() + "\"")
                .body(recurso);
    }

    @Operation(summary = "Deleta um arquivo (restrições: estudantes só podem deletar os próprios arquivos)")
    @DeleteMapping("/{arquivoId}")
    public ResponseEntity<Void> deletarArquivo(
            @PathVariable Long arquivoId,
            @RequestParam Long usuarioId,
            @RequestParam(defaultValue = "false") boolean isEducador
    ) {
        arquivoService.deletar(arquivoId, usuarioId, isEducador);
        return ResponseEntity.noContent().build();
    }
}
