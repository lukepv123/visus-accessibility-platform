package com.fatec.bluds.api.infra.exceptions.comentario;

public class ComentarioNotFoundException extends RuntimeException {
    public ComentarioNotFoundException(String message) {
        super(message);
    }
}
