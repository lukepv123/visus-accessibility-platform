package com.fatec.bluds.api.domain.usuario.subclasses.gestor.repository;


import com.fatec.bluds.api.domain.usuario.subclasses.gestor.model.Gestor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GestorRepository extends JpaRepository<Gestor, Long> {

    Optional<Gestor> findByEmail(String email);
}
