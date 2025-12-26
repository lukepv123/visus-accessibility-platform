package com.fatec.bluds.api.infra.exceptions.tarefa;

public class TarefaNotFoundException extends RuntimeException {

    public TarefaNotFoundException(String message) {
        super(message);
    }
}
