package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.model;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.model.Postagem;
import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.subclasses.tarefa.resposta.model.Resposta;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "tarefa")
@DiscriminatorValue("TAREFA")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Tarefa extends Postagem {

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dataExpiracao;

    @NotNull
    @Column(nullable = false)
    private Double valorTotal;

    @OneToMany(mappedBy = "tarefa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Resposta> respostas = new HashSet<>();

    private Boolean permitirArquivoResposta = true;

}
