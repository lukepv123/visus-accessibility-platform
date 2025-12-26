package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.dto;

import java.util.List;

public record EstudantesByBulkDTO(
        List<Long> estudantesIds
) {
}
