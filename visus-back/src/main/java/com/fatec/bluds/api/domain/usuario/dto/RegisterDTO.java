package com.fatec.bluds.api.domain.usuario.dto;

import com.fatec.bluds.api.domain.usuario.dto.Enums.UserTypeEnum;
import com.fatec.bluds.api.domain.usuario.enums.Genero;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record RegisterDTO(
        @NotBlank
        String nome,
        @NotBlank
        String cpf,
        @NotBlank
        String email,
        @NotBlank
        String telefone,
        Genero genero,
        LocalDate dataNascimento,
        @NotBlank
        String senha,
        UserTypeEnum userType,

        // Campos opcionais dependendo do tipo de usuário:

        // Matricula pode variar conforme o tipo de usuário
        String matricula,

        // 1 - Campos de Educador
        String titulo,

        // 2 - Campos de Estudante
        Periodo periodo,
        AnoEscolar anoEscolar,

        // 3 - Campos de Gestor
        String cargo
) {
    @AssertTrue(message = "Estudante deve ter matrícula, período e ano escolar")
    public boolean isEstudanteValido() {
        if (userType == UserTypeEnum.ESTUDANTE) {
            return matricula != null && periodo != null && anoEscolar != null;
        }

        return true;
    }

    @AssertTrue(message = "Educador deve ter título")
    public boolean isEducadorValido() {
        if (userType == UserTypeEnum.EDUCADOR) {
            return titulo != null;
        }

        return true;
    }
}
