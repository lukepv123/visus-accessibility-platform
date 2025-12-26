package com.fatec.bluds.api.domain.usuario.service;

import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.domain.usuario.repository.UsuarioRepository;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario getAuthenticatedUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UsuarioNotFoundException("Usuário não autenticado");
        }

        String email = authentication.getName();

        return repository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuário autenticado não encontrado"));
    }

    public Optional<Usuario> getUsuarioById(Long id) {
        return repository.findById(id);
    }
}
