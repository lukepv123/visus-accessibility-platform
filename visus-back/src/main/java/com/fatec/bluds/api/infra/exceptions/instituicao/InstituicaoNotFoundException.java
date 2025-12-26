package com.fatec.bluds.api.infra.exceptions.instituicao;

public class InstituicaoNotFoundException extends RuntimeException {

    public InstituicaoNotFoundException(String mensagem) {
        super(mensagem);
    }
}
