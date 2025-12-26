package com.fatec.bluds.api.domain.usuario.subclasses.educador.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "formacoes")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "educador")
// equals/hashCode SOMENTE por id para evitar problemas de inicialização de coleção
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Formacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String instituicao;

    private LocalDate dataInicio;
    private LocalDate dataConclusao;

    @Column(length = 1000)
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "educador_id", nullable = false)
    private Educador educador;
}
