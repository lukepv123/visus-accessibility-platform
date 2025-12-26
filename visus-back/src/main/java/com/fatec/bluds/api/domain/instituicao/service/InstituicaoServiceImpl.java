package com.fatec.bluds.api.domain.instituicao.service;

import com.fatec.bluds.api.domain.instituicao.dto.UpdateInstituicaoDTO;
import com.fatec.bluds.api.domain.instituicao.dto.CreateInstituicaoDTO;
import com.fatec.bluds.api.domain.instituicao.dto.InstituicaoDetailsDTO;
import com.fatec.bluds.api.domain.instituicao.model.InstituicaoEnsino;
import com.fatec.bluds.api.domain.instituicao.repository.InstituicaoRepository;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.domain.usuario.repository.UsuarioRepository;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.model.Gestor;
import com.fatec.bluds.api.infra.exceptions.instituicao.InstituicaoNotFoundException;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstituicaoServiceImpl implements InstituicaoService {

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public InstituicaoEnsino createInstituicao(CreateInstituicaoDTO dto, Gestor gestor) {
        if (gestor.getInstituicaoEnsino() != null) {
            throw new IllegalStateException("O Gestor já está associado a uma Instituição de Ensino");
        }

        InstituicaoEnsino instituicaoEnsino = new InstituicaoEnsino();

        instituicaoEnsino.setNome(dto.nome());
        instituicaoEnsino.setTelefone(dto.telefone());
        instituicaoEnsino.setCnpj(dto.cnpj());
        instituicaoEnsino.setEmail(dto.email());
        instituicaoEnsino.setEndereco(dto.endereco());

        InstituicaoEnsino instituicaoEnsinoSaved = instituicaoRepository.save(instituicaoEnsino);

        gestor.setInstituicaoEnsino(instituicaoEnsino);

        return usuarioRepository.save(gestor).getInstituicaoEnsino();
    }

    public InstituicaoEnsino getInstituicaoById(Long id) {
        Optional<InstituicaoEnsino> optionalInstituicao = instituicaoRepository.findById(id);

        return optionalInstituicao.orElseThrow(
                () -> new InstituicaoNotFoundException("Não foi possível encontrar a Instituição de Ensino")
        );
    }

    public List<InstituicaoDetailsDTO> getInstituicoes() {
        return instituicaoRepository.findAllByOrderByNomeAsc().stream().map(InstituicaoDetailsDTO::new).toList();
    }

    @Transactional
    public InstituicaoEnsino updateInstituicao(Long id, UpdateInstituicaoDTO dto) {
        InstituicaoEnsino inst = getInstituicaoById(id);

        if (dto.nome() != null && !dto.nome().isBlank()) {
            inst.setNome(dto.nome());
        }

        if (dto.telefone() != null && !dto.telefone().isBlank()) {
            inst.setTelefone(dto.telefone());
        }

        if (dto.cnpj() != null && !dto.cnpj().isBlank()) {
            inst.setCnpj(dto.cnpj());
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            inst.setEmail(dto.email());
        }

        if (dto.endereco() != null) {
            inst.setEndereco(dto.endereco());
        }

        instituicaoRepository.save(inst);

        return inst;
    }

    @Transactional
    public List<Usuario> addUsuarioToInstituicao(Long instituicaoId, Long usuarioId) {
        InstituicaoEnsino instituicao = this.getInstituicaoById(instituicaoId);

        Usuario usuario = usuarioRepository
                .findById(usuarioId)
                .orElseThrow(
                        () -> new UsuarioNotFoundException("Usuário com o ID " + usuarioId + " não encontrado")
                );

        if (usuario.getInstituicaoEnsino() != null) {
            throw new IllegalStateException("Usuário só pode estar associado a uma Instituição de Ensino");
        }

        instituicao.getUsuarios().add(usuario);

        usuario.setInstituicaoEnsino(instituicao);
        usuarioRepository.save(usuario);

        return this.getUsuariosFromInstituicao(instituicao.getId());
    }

    @Transactional
    public List<Usuario> removeUsuarioFromInstituicao(Long instituicaoId, Long usuarioId) {
        InstituicaoEnsino instituicao = this.getInstituicaoById(instituicaoId);

        Usuario usuario = usuarioRepository
                .findById(usuarioId)
                .orElseThrow(UsuarioNotFoundException::new);

        if (!usuarioBelongsToInstituicao(usuarioId, instituicaoId)) {
            throw new IllegalArgumentException("O usuário não pertence a esta Instituição de Ensino");
        }

        instituicao.getUsuarios().remove(usuario);

        usuario.setInstituicaoEnsino(null);
        usuarioRepository.save(usuario);

        return this.getUsuariosFromInstituicao(instituicao.getId());
    }

    @Override
    public boolean instituicaoExists(Long id) {
        return instituicaoRepository.existsById(id);
    }

    @Override
    public boolean usuarioBelongsToInstituicao(Long usuarioId, Long instituicaoId) {
        if (instituicaoId == null || usuarioId == null) {
            return false;
        }

        return usuarioRepository.existsByIdAndInstituicaoEnsinoId(usuarioId, instituicaoId);
    }

    @Override
    public InstituicaoEnsino getInstituicaoByCnpj(String cnpj) {
        if (cnpj == null || cnpj.isBlank()) {
            throw new IllegalArgumentException("CNPJ não pode ser nulo ou vazio");
        }

        return instituicaoRepository.findByCnpj(cnpj).orElseThrow(
                () -> new InstituicaoNotFoundException("Instituição de Ensino com o CNPJ " + cnpj + " não encontrada")
        );
    }

    @Override
    public InstituicaoEnsino getInstituicaoByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email não pode ser nulo ou vazio");
        }

        return instituicaoRepository.findByEmail(email).orElseThrow(
                () -> new InstituicaoNotFoundException("Instituição de Ensino com o email " + email + " não encontrada")
        );
    }

    @Override
    public List<Usuario> getUsuariosFromInstituicao(Long instituicaoId) {
        if (instituicaoId == null || instituicaoId <= 0) {
            throw new IllegalArgumentException("ID da Instituição inválido - ID não pode ser nulo ou menor que 1");
        }

        return usuarioRepository.findAllByInstituicaoId(instituicaoId);
    }
}
