package com.fatec.bluds.api.domain.usuario.subclasses.educador.repository;

import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Educador;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EducadorRepository extends JpaRepository<Educador, Long> {

    @EntityGraph(attributePaths = "formacoes")
    Optional<Educador> findWithFormacoesById(Long id);

    Optional<Educador> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    boolean existsByMatricula(String matricula);
}

