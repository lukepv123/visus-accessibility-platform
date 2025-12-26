package com.fatec.bluds.api.domain.usuario.subclasses.gestor.model;

import com.fatec.bluds.api.domain.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity(name = "Gestor")
@DiscriminatorValue("GESTOR")
@AllArgsConstructor
@NoArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Gestor extends Usuario {
    @Column
    private String matricula;

    @Column
    private String cargo;
}
