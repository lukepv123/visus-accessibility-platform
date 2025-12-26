package com.fatec.bluds.api.infra.exceptions.postagem;

public class PostagemNotFoundException extends RuntimeException {

    public PostagemNotFoundException(String message) {
        super(message);
    }
}
