package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.enums.TipoDeficiencia;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.model.PerfilAcessibilidade;

public record PerfilAcessibilidadeSummaryDTO(
        String estudante,
        Long id,
        TipoDeficiencia tipoDeficiencia,
        Boolean usaLeitorDeTela,
        Boolean modoAltoContraste,
        Integer tamanhoFonte,
        Boolean talkBack
) {
    public PerfilAcessibilidadeSummaryDTO(PerfilAcessibilidade perfilAcessibilidade) {
        this(
                perfilAcessibilidade.getEstudante().getNome(),
                perfilAcessibilidade.getId(),
                perfilAcessibilidade.getTipoDeficiencia(),
                perfilAcessibilidade.isUsaLeitorDeTela(),
                perfilAcessibilidade.isModoAltoContraste(),
                perfilAcessibilidade.getTamanhoFonte(),
                perfilAcessibilidade.isTalkBack()
        );
    }
}
