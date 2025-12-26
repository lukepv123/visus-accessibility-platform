package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.model.Arquivo;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * DTO responsável por transferir dados do Arquivo
 * entre a camada de serviço e o controller.
 */
@Schema
public record ArquivoDTO(
        Long id,
        String nomeOriginal,
        String caminho,
        LocalDateTime dataEnvio,
        String tipoMime,
        String enviadoPor
) {

    /**
     * Construtor auxiliar que permite criar o DTO diretamente
     * a partir de uma entidade Arquivo.
     */
    public ArquivoDTO(Arquivo arquivo) {
        this(
                arquivo.getId(),
                arquivo.getNomeOriginal(),
                arquivo.getCaminho(),
                arquivo.getDataEnvio(),
                arquivo.getTipoMime(),
                arquivo.getEnviadoPor() != null ? arquivo.getEnviadoPor().getNome() : null
        );
    }
}
