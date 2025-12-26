package com.fatec.bluds.api.domain.passwordreset.service;

import com.fatec.bluds.api.domain.passwordreset.dto.PasswordResetDTO;
import com.fatec.bluds.api.domain.passwordreset.dto.RequestResetDTO;
import com.fatec.bluds.api.domain.passwordreset.model.PasswordResetToken;
import com.fatec.bluds.api.domain.passwordreset.repository.PasswordResetTokenRepository;
import com.fatec.bluds.api.domain.usuario.repository.UsuarioRepository;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.infra.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class PasswordResetService {
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Value("${api.address}")
    private String appAdress;

    public void processRequest(RequestResetDTO dto) throws MessagingException {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(dto.email());

        if (usuarioOptional.isEmpty()) return;

        Usuario usuario = usuarioOptional.get();
        String token = makePasswordResetToken();

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setToken(token);
        passwordResetToken.setUsuario(usuario);
        passwordResetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        tokenRepository.save(passwordResetToken);

        sendPasswordResetEmail(usuario, token);
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> optionalResetToken = tokenRepository.findByToken(token);

        return optionalResetToken.isPresent() && !optionalResetToken.get().isExpired();
    }

    @Transactional
    public boolean updatePassword(PasswordResetDTO dto) {
        if (!validateToken(dto.token())) return false;

        return tokenRepository.findByToken(dto.token())
                .map(resetToken -> {
                    Usuario usuario = resetToken.getUsuario();

                    String encryptedPassword = new BCryptPasswordEncoder().encode(dto.password());

                    usuario.setSenha(encryptedPassword);

                    usuarioRepository.save(usuario);

                    resolveUserTokens(usuario);

                    return true;
                })
                .orElse(false);
    }

    private void resolveUserTokens(Usuario usuario) {
        tokenRepository.deleteByUsuario(usuario);
    }

    private String makePasswordResetToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        return base64Encoder.encodeToString(randomBytes);
    }

    private String buildResetLink(String token) {
        return appAdress + "/reset-password/validate?token=" + token;
    }

    private void sendPasswordResetEmail(Usuario usuario, String token) throws MessagingException {
        Context context = new Context();
        context.setVariable("nome", usuario.getNome());
        context.setVariable("link", buildResetLink(token));

        String subject = "GIMAS | Redefinição de Senha";
        String body = templateEngine.process("email/password-reset-email.html", context);

        emailService.sendEmail(usuario.getEmail(), subject, body);
    }
}
