package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.service;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.arquivo.dto.ArquivoDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

public interface ArquivoService {

    ArquivoDTO upload(Long disciplinaId, MultipartFile arquivo, String descricao, Long usuarioId) throws IOException;

    Resource download(Long arquivoId) throws MalformedURLException;

    List<ArquivoDTO> listarArquivos(Long disciplinaId);

    void deletar(Long arquivoId, Long usuarioId, boolean isEducador);

    String salvar(MultipartFile arquivo, String subpasta);

}