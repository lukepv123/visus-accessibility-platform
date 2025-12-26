package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.repository;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.model.Arquivo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArquivoRepository extends JpaRepository<Arquivo, Long> {
    List<Arquivo> findByDisciplinaId(Long disciplinaId);
}
