package com.fatec.bluds.api.domain.usuario.repository;

import com.fatec.bluds.api.domain.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    UserDetails findUserDetailsByEmail(String email);
    Optional<Usuario> findByEmail(String email);

    boolean existsByIdAndInstituicaoEnsinoId(Long usuarioId, Long instituicaoId);

    @Query("SELECT u FROM Usuario u WHERE u.instituicaoEnsino.id = :instituicaoId")
    List<Usuario> findAllByInstituicaoId(@Param("instituicaoId") Long instituicaoId);
}
