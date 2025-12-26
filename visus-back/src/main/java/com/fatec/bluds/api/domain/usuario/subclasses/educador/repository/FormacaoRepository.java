package com.fatec.bluds.api.domain.usuario.subclasses.educador.repository;

import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Formacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormacaoRepository extends JpaRepository<Formacao, Long> {
}
