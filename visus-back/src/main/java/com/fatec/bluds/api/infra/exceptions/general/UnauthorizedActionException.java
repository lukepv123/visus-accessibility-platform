package com.fatec.bluds.api.infra.exceptions.general;

public class UnauthorizedActionException extends RuntimeException {
    public UnauthorizedActionException(String s) {
        super(s);
    }
}
