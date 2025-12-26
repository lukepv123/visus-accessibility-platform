package com.fatec.bluds.api.domain.usuario.subclasses.estudante.model;

import com.fatec.bluds.api.domain.instituicao.subdomain.disciplina.model.Disciplina;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.perfilacessibilidade.model.PerfilAcessibilidade;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "Estudante")
@DiscriminatorValue("ESTUDANTE")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Estudante extends Usuario {
    @Column(unique = true)
    @NotNull
    private String matricula;

    @Column
    @NotNull
    private Periodo periodo;

    @Column
    @NotNull
    private AnoEscolar anoEscolar;

    @ManyToMany
    @JoinTable(
            name = "estudante_disciplina",
            joinColumns = @JoinColumn(name = "estudante_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private Set<Disciplina> disciplinas = new HashSet<>();

    @OneToOne(mappedBy = "estudante", cascade = CascadeType.ALL, orphanRemoval = true)
    private PerfilAcessibilidade perfilAcessibilidade;
}
