package com.fatec.bluds.api.domain.usuario.roles;

import org.springframework.security.core.GrantedAuthority;

public enum Roles implements GrantedAuthority {
    ESTUDANTE("Estudante"),
    EDUCADOR("Educador"),
    GESTOR("Gestor"),
    GUEST("Guest"),
    USER("User"),
    ADMIN("Admin");

    private String roleName;

    Roles(String roleName) {
        this.roleName = roleName;
    }

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }

    public String obterNome() {
        return this.roleName;
    }
}
