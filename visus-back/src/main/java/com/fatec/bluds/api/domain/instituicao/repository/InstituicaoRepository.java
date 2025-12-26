package com.fatec.bluds.api.domain.instituicao.repository;

import com.fatec.bluds.api.domain.instituicao.model.InstituicaoEnsino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InstituicaoRepository extends JpaRepository<InstituicaoEnsino, Long> {
    public List<InstituicaoEnsino> findAllByOrderByNomeAsc();

    Optional<InstituicaoEnsino> findByCnpj(String cnpj);
    Optional<InstituicaoEnsino> findByEmail(String email);
}
