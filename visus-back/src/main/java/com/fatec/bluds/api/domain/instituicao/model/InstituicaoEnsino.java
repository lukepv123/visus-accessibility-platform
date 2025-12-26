package com.fatec.bluds.api.domain.instituicao.model;

import com.fatec.bluds.api.domain.instituicao.endereco.Endereco;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity(name = "Instituicao")
@Table(name = "Instituicao")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InstituicaoEnsino {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @NotNull
    private String nome;

    @Column(unique = true)
    @NotNull
    private String telefone;

    @Column(unique = true)
    @NotNull
    private String email;

    @Column(unique = true)
    @NotNull
    private String cnpj;

    @Embedded
    private Endereco endereco;

    @OneToMany(mappedBy = "instituicaoEnsino")
    private Set<Usuario> usuarios = new HashSet<>();
}
