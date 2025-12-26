package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.dto;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.model.Publicacao;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.dto.EducadorSummaryDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema
public record PublicacaoDetailsDTO(
        Long id,
        String titulo,
        String conteudo,
        String caminhoAnexo,
        LocalDateTime dataEnvio,
        EducadorSummaryDTO autor
) {
    public PublicacaoDetailsDTO(Publicacao publicacao) {
        this(
                publicacao.getId(),
                publicacao.getTitulo(),
                publicacao.getConteudo(),
                publicacao.getCaminhoAnexo(),
                publicacao.getDataEnvio(),
                new EducadorSummaryDTO(publicacao.getAutor())
        );
    }
}
