package com.fatec.bluds.api.domain.passwordreset.repository;

import com.fatec.bluds.api.domain.passwordreset.model.PasswordResetToken;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    long deleteByUsuario(Usuario usuario);
}
