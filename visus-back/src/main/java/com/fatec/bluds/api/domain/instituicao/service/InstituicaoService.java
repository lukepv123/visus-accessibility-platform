package com.fatec.bluds.api.domain.instituicao.service;

import com.fatec.bluds.api.domain.instituicao.dto.CreateInstituicaoDTO;
import com.fatec.bluds.api.domain.instituicao.dto.InstituicaoDetailsDTO;
import com.fatec.bluds.api.domain.instituicao.dto.UpdateInstituicaoDTO;
import com.fatec.bluds.api.domain.instituicao.model.InstituicaoEnsino;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.domain.usuario.subclasses.gestor.model.Gestor;

import java.util.List;

public interface InstituicaoService {
    InstituicaoEnsino createInstituicao(CreateInstituicaoDTO dto, Gestor gestor);
    InstituicaoEnsino getInstituicaoById(Long id);
    List<InstituicaoDetailsDTO> getInstituicoes();
    InstituicaoEnsino updateInstituicao(Long id, UpdateInstituicaoDTO dto);

    List<Usuario> addUsuarioToInstituicao(Long instituicaoId, Long usuarioId);
    List<Usuario> removeUsuarioFromInstituicao(Long instituicaoId, Long usuarioId);

    boolean instituicaoExists(Long id);
    boolean usuarioBelongsToInstituicao(Long instituicaoId, Long usuarioId);

    InstituicaoEnsino getInstituicaoByCnpj(String cnpj);
    InstituicaoEnsino getInstituicaoByEmail(String email);

    List<Usuario> getUsuariosFromInstituicao(Long instituicaoId);
}
