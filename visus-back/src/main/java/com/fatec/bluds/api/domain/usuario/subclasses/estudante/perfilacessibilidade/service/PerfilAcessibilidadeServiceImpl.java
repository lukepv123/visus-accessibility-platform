package com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.service;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.CreatePerfilAcessibilidadeDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.dto.UpdatePerfilAcessibilidadeDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.model.PerfilAcessibilidade;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.repository.PerfilAcessibilidadeRepository;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.service.EstudanteService;
import com.fatec.bluds.api.infra.exceptions.perfilacessibilidade.PerfilAcessibilidadeNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class PerfilAcessibilidadeServiceImpl implements PerfilAcessibilidadeService {

    private final PerfilAcessibilidadeRepository repository;
    private final EstudanteService estudanteService;

    public PerfilAcessibilidadeServiceImpl(PerfilAcessibilidadeRepository repository, EstudanteService estudanteService) {
        this.repository = repository;
        this.estudanteService = estudanteService;
    }

    @Override
    public PerfilAcessibilidade createPerfilAcessibilidade(Long estudanteId, CreatePerfilAcessibilidadeDTO dto) {
        Estudante estudante = estudanteService.getEstudanteById(estudanteId);
        PerfilAcessibilidade perfil = new PerfilAcessibilidade();

        perfil.setTipoDeficiencia(dto.tipoDeficiencia());
        perfil.setUsaLeitorDeTela(dto.usaLeitorDeTela());
        perfil.setModoAltoContraste(dto.modoAltoContraste());
        perfil.setTamanhoFonte(dto.tamanhoFonte());
        perfil.setTalkBack(dto.talkBack());
        perfil.setEstudante(estudante);

        return repository.save(perfil);
    }

    @Override
    public PerfilAcessibilidade getById(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new PerfilAcessibilidadeNotFoundException("Não foi possível encontrar Perfil de Acessibilidade com ID " + id)
        );
    }

    @Override
    public PerfilAcessibilidade getByEstudante(Long estudanteId) {
        return repository.findByEstudanteId(estudanteId).orElseThrow(
                () -> new PerfilAcessibilidadeNotFoundException("Não foi possível encontrar um Perfil de Acessibilidade para este Estudante")
        );
    }

    @Override
    public PerfilAcessibilidade updatePerfilAcessibilidade(Long perfilId, UpdatePerfilAcessibilidadeDTO dto) {
        PerfilAcessibilidade perfil = this.getById(perfilId);

        Optional.ofNullable(dto.tipoDeficiencia())
                .ifPresent(perfil::setTipoDeficiencia);

        Optional.ofNullable(dto.usaLeitorDeTela())
                .ifPresent(perfil::setUsaLeitorDeTela);

        Optional.ofNullable(dto.modoAltoContraste())
                .ifPresent(perfil::setModoAltoContraste);

        Optional.ofNullable(dto.tamanhoFonte())
                .filter(tamanhoFonte -> tamanhoFonte > 0)
                .ifPresent(perfil::setTamanhoFonte);

        Optional.ofNullable(dto.talkBack())
                .ifPresent(perfil::setTalkBack);

        return repository.save(perfil);
    }

    @Override
    public void removePerfilAcessibilidade(Long id) {
        PerfilAcessibilidade perfil = this.getById(id);

        repository.delete(perfil);
    }
}
