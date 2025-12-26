package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.enums.TipoDeficiencia;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreatePerfilAcessibilidadeDTO(
        @NotNull
        TipoDeficiencia tipoDeficiencia,

        @NotNull
        Boolean usaLeitorDeTela,

        @NotNull
        Boolean modoAltoContraste,

        @NotNull
        @Positive
        Integer tamanhoFonte,

        @NotNull
        Boolean talkBack
) {
}
