package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.service;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.CreatePerfilAcessibilidadeDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.UpdatePerfilAcessibilidadeDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.model.PerfilAcessibilidade;

public interface PerfilAcessibilidadeService {
    PerfilAcessibilidade createPerfilAcessibilidade(Long estudanteId, CreatePerfilAcessibilidadeDTO dto);
    PerfilAcessibilidade getById(Long id);
    PerfilAcessibilidade getByEstudante(Long estudanteId);
    PerfilAcessibilidade updatePerfilAcessibilidade(Long perfilId, UpdatePerfilAcessibilidadeDTO dto);
    void removePerfilAcessibilidade(Long id);
}
