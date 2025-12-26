package com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.subdomain.postagem.model;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.Educador;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity(name = "postagem")
@Table(name = "postagem")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_postagem", discriminatorType = DiscriminatorType.STRING)
public abstract class Postagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String titulo;

    @NotNull
    private String conteudo;

    @NotNull
    private LocalDateTime dataEnvio;

    private String caminhoAnexo;

    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "educador_id", nullable = false)
    private Educador autor;

    @PrePersist
    protected void onCreate() {
        dataEnvio = LocalDateTime.now();
    }
}
