package com.fatec.bluds.api.domain.usuario.subclasses.estudante.service;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteListDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteUpdateDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteSummaryDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.repository.EstudanteRepository;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EstudanteService {

    @Autowired
    private EstudanteRepository repository;

    /**
     * Atualiza as informações de um Estudante existente.
     * Apenas campos válidos e não nulos são alterados.
     * Caso o ID não seja encontrado, lança 404.
     * Caso nenhum campo seja válido, lança 422.
     */
    public Estudante atualizar(Long id, EstudanteUpdateDTO dto) {
        Estudante estudante = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudante não encontrado"));

        boolean alterado = false;

        // Atualização condicional dos campos
        if (dto.nome() != null && !dto.nome().isBlank()) {
            estudante.setNome(dto.nome());
            alterado = true;
        }

        if (dto.telefone() != null && !dto.telefone().isBlank()) {
            estudante.setTelefone(dto.telefone());
            alterado = true;
        }

        if (dto.genero() != null) {
            estudante.setGenero(dto.genero());
            alterado = true;
        }

        if (dto.dataNascimento() != null) {
            estudante.setDataNascimento(dto.dataNascimento());
            alterado = true;
        }

        // Nenhum campo informado corretamente
        if (!alterado) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Nenhum campo válido para atualização");
        }

        return repository.save(estudante);
    }

    /**
     * Retorna as informações completas de um Estudante a partir de seu ID.
     */
    public EstudanteSummaryDTO buscarPorId(Long id) {
        var estudante = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudante não encontrado"));
        return new EstudanteSummaryDTO(
                estudante.getId(),
                estudante.getNome(),
                estudante.getCpf(),
                estudante.getEmail(),
                estudante.getMatricula(),
                estudante.getPeriodo(),
                estudante.getAnoEscolar(),
                estudante.getTelefone(),
                estudante.getGenero(),
                estudante.getDataNascimento()
        );
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public Estudante getEstudanteById(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new UsuarioNotFoundException("Estudante com o ID " + id + " não encontrado")
        );
    }

    /**
     * Lista estudantes com filtros opcionais.
     */
    public List<EstudanteListDTO> listar(AnoEscolar anoEscolar, Periodo periodo, String nome) {
        var lista = repository.listarEstudantes(anoEscolar, periodo, nome);
        if (lista.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum estudante encontrado");
        }
        return lista;
    }

    /**
     * Remove um Estudante existente pelo ID.
     */
    public void remover(Long id) {
        var estudante = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudante não encontrado"));
        repository.delete(estudante);
    }
}
