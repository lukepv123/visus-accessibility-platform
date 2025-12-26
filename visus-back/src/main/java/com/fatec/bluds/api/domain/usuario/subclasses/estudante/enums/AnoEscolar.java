package com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums;

public enum AnoEscolar {
    PRIMEIRO_ANO("Primeiro Ano", GrauAcademico.FUNDAMENTAL_01),
    SEGUNDO_ANO("Segundo Ano", GrauAcademico.FUNDAMENTAL_01),
    TERCEIRO_ANO("Terceiro Ano", GrauAcademico.FUNDAMENTAL_01),
    QUARTO_ANO("Quarto Ano", GrauAcademico.FUNDAMENTAL_01),
    QUINTO_ANO("Quinto Ano", GrauAcademico.FUNDAMENTAL_01),
    SEXTO_ANO("Sexto Ano", GrauAcademico.FUNDAMENTAL_02),
    SETIMO_ANO("Sétimo Ano", GrauAcademico.FUNDAMENTAL_02),
    OITAVO_ANO("Oitavo Ano", GrauAcademico.FUNDAMENTAL_02),
    NONO_ANO("Nono Ano", GrauAcademico.FUNDAMENTAL_02),
    PRIMEIO_ANO_EM("Primeiro Ano do Ensino Médio", GrauAcademico.ENSINO_MEDIO),
    SEGUNDO_ANO_EM("Segundo Ano do Ensino Médio", GrauAcademico.ENSINO_MEDIO),
    TERCEIRO_ANO_EM("Terceiro Ano do Ensino Médio", GrauAcademico.ENSINO_MEDIO);

    private String anoEscolarName;
    private GrauAcademico grauAcademico;

    AnoEscolar(String anoEscolarName, GrauAcademico grauAcademico) {
        this.anoEscolarName = anoEscolarName;
        this.grauAcademico = grauAcademico;
    }
}
