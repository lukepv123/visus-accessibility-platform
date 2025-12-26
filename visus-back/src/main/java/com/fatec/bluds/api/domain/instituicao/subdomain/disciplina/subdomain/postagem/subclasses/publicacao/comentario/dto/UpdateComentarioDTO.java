package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.dto;

import jakarta.validation.constraints.Size;

public record UpdateComentarioDTO(
        @Size(max = 280)
        String conteudo
) {
}
