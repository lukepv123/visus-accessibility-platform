package com.fatec.bluds.api.domain.usuario.subclasses.educador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormacaoResponseDTO {
    private Long id;
    private String titulo;
    private String instituicao;
    private LocalDate dataInicio;
    private LocalDate dataConclusao;
    private String descricao;
}
