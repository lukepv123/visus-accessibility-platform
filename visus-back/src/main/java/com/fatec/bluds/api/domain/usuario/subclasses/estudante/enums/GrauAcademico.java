package com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums;

public enum GrauAcademico {
    FUNDAMENTAL_01("Fundamental 01"),
    FUNDAMENTAL_02("Fundamental 02"),
    ENSINO_MEDIO("Ensino Médio");

    private String grauName;

    GrauAcademico(String grauName) {
        this.grauName = grauName;
    }
}
