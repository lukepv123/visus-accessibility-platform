package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.repository;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.model.PerfilAcessibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfilAcessibilidadeRepository extends JpaRepository<PerfilAcessibilidade, Long> {
    Optional<PerfilAcessibilidade> findByEstudanteId(Long estudanteId);
}
