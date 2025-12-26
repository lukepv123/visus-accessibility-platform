package com.fatec.bluds.api.domain.instituicao.dto;

import com.fatec.bluds.api.domain.instituicao.endereco.Endereco;
import com.fatec.bluds.api.domain.instituicao.model.InstituicaoEnsino;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema
public record InstituicaoDetailsDTO(
        Long id,
        String nome,
        String telefone,
        String email,
        String cnpj,
        Endereco endereco
) {
    public InstituicaoDetailsDTO(InstituicaoEnsino instituicaoEnsino) {
        this(
                instituicaoEnsino.getId(),
                instituicaoEnsino.getNome(),
                instituicaoEnsino.getTelefone(),
                instituicaoEnsino.getEmail(),
                instituicaoEnsino.getCnpj(), 
                instituicaoEnsino.getEndereco()
        );
    }
}
