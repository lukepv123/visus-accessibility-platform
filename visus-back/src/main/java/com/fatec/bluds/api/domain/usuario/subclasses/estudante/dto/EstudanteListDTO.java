package com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;

public record EstudanteListDTO(
    Long id,
    String nome,
    String email,
    String matricula,
    AnoEscolar anoEscolar,
    Periodo periodo
) {}
