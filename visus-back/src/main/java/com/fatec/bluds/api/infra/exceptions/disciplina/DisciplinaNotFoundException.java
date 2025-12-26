package com.fatec.bluds.api.infra.exceptions.disciplina;

public class DisciplinaNotFoundException extends RuntimeException {
    public DisciplinaNotFoundException(String message) {
        super(message);
    }
}
