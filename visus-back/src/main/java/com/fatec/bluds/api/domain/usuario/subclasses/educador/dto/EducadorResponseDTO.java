package com.fatec.bluds.api.domain.usuario.subclasses.educador.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducadorResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String matricula;
    private String titulo;
    private List<FormacaoResponseDTO> formacaoAcademica;
}
