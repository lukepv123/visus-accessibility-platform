package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.repository;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.publicacao.comentario.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    @Query("SELECT DISTINCT c FROM comentario c LEFT JOIN FETCH c.respostas WHERE c.publicacao.id = :publicacaoId AND c.comentarioPai IS NULL")
    List<Comentario> findRootComentariosWithRespostasByPublicacaoIdAndComentarioPaiIsNull(Long publicacaoId);
}
