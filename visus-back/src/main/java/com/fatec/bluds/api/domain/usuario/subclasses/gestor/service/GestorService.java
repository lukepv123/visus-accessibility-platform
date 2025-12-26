package com.fatec.bluds.api.domain.usuario.subclasses.gestor.service;

import com.fatec.bluds.api.domain.usuario.subclasses.gestor.dto.GestorGetByEmailDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.dto.UpdateGestorDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.model.Gestor;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.repository.GestorRepository;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GestorService {

    @Autowired
    private GestorRepository repository;

    public Gestor getGestorById(Long id) {
        Optional<Gestor> optionalGestor = repository.findById(id);

        return optionalGestor.orElseThrow(
                () -> new UsuarioNotFoundException("Gestor com ID " + id + " não foi encontrado")
        );
    }

    public Gestor getGestorByEmail(GestorGetByEmailDTO dto) {
        Optional<Gestor> optionalGestor = repository.findByEmail(dto.email());

        return optionalGestor.orElseThrow(
                () -> new UsuarioNotFoundException("Gestor com e-mail " + dto.email() + " não foi encontrado")
        );
    }

    public void updateGestor(Gestor gestor, UpdateGestorDTO dto) {
        if (dto.nome() != null && !dto.nome().isBlank()) {
            gestor.setNome(dto.nome());
        }

        if (dto.telefone() != null && !dto.telefone().isBlank()) {
            gestor.setTelefone(dto.telefone());
        }

        if (dto.genero() != null) {
            gestor.setGenero(dto.genero());
        }

        if (dto.dataNascimento() != null) {
            gestor.setDataNascimento(dto.dataNascimento());
        }

        if (dto.cargo() != null) {
            gestor.setCargo(dto.cargo());
        }

        if (dto.matricula() != null && !dto.matricula().isBlank()) {
            gestor.setMatricula(dto.matricula());
        }

        repository.save(gestor);
    }
}
