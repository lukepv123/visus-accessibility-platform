package com.fatec.bluds.api.domain.usuario.subclasses.educador.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormacaoListResponseDTO {
    private List<FormacaoResponseDTO> formacoes;
    private Integer totalRegistros;
}