package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.enums.TipoDeficiencia;

public record UpdatePerfilAcessibilidadeDTO(
        TipoDeficiencia tipoDeficiencia,
        Boolean usaLeitorDeTela,
        Boolean modoAltoContraste,
        Integer tamanhoFonte,
        Boolean talkBack
) {
}
