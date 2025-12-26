package com.fatec.bluds.api.domain.instituicao.endereco;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Endereco {
    @Column
    @NotBlank
    private String logradouro;

    @Column
    @NotBlank
    private String numero;

    @Column
    @NotBlank
    private String bairro;

    @Column
    @NotBlank
    private String cidade;

    @Column
    @NotBlank
    private String estado;

    @Column
    @NotBlank
    private String cep;
}
