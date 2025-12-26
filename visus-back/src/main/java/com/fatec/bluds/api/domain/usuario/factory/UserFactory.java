package com.fatec.bluds.api.domain.usuario.factory;

import com.fatec.bluds.api.domain.usuario.dto.RegisterDTO;
import com.fatec.bluds.api.domain.usuario.roles.Roles;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Educador;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.model.Gestor;
import com.fatec.bluds.api.domain.usuario.model.Usuario;

public class UserFactory {

    public static Usuario createUser(RegisterDTO dto) {
        switch (dto.userType()) {
            case ESTUDANTE -> {
                Estudante estudante = new Estudante();
                estudante.setNome(dto.nome());
                estudante.setCpf(dto.cpf());
                estudante.setEmail(dto.email());
                estudante.setTelefone(dto.telefone());
                estudante.setGenero(dto.genero());
                estudante.setDataNascimento(dto.dataNascimento());
                estudante.setSenha(dto.senha());
                estudante.setRoles(Roles.ESTUDANTE);
                estudante.setMatricula(dto.matricula());
                estudante.setPeriodo(dto.periodo());
                estudante.setAnoEscolar(dto.anoEscolar());

                return estudante;
            }
            case EDUCADOR -> {
                Educador educador = new Educador();
                educador.setNome(dto.nome());
                educador.setCpf(dto.cpf());
                educador.setEmail(dto.email());
                educador.setTelefone(dto.telefone());
                educador.setGenero(dto.genero());
                educador.setDataNascimento(dto.dataNascimento());
                educador.setSenha(dto.senha());
                educador.setRoles(Roles.EDUCADOR);
                educador.setTitulo(dto.titulo());

                return educador;
            }
            case GESTOR -> {
                Gestor gestor = new Gestor();
                gestor.setNome(dto.nome());
                gestor.setCpf(dto.cpf());
                gestor.setEmail(dto.email());
                gestor.setTelefone(dto.telefone());
                gestor.setGenero(dto.genero());
                gestor.setDataNascimento(dto.dataNascimento());
                gestor.setSenha(dto.senha());
                gestor.setRoles(Roles.GESTOR);
                gestor.setCargo(dto.cargo());

                return gestor;
            }
            default -> throw new IllegalArgumentException("Tipo de usuário inválido: " + dto.userType());
        }
    }
}
