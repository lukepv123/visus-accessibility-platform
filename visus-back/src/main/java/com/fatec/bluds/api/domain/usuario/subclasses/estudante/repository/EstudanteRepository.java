package com.fatec.bluds.api.domain.usuario.subclasses.estudante.repository;

import com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteListDTO;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.model.Estudante;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.AnoEscolar;
import com.fatec.bluds.api.domain.usuario.subclasses.estudante.enums.Periodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudanteRepository extends JpaRepository<Estudante, Long> {

    @Query("""
        SELECT new com.fatec.bluds.api.domain.usuario.subclasses.estudante.dto.EstudanteListDTO(
            e.id, e.nome, e.email, e.matricula, e.anoEscolar, e.periodo
        )
        FROM Estudante e
        WHERE (:anoEscolar IS NULL OR e.anoEscolar = :anoEscolar)
          AND (:periodo IS NULL OR e.periodo = :periodo)
          AND (:nome IS NULL OR LOWER(e.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
    """)
    List<EstudanteListDTO> listarEstudantes(
            @Param("anoEscolar") AnoEscolar anoEscolar,
            @Param("periodo") Periodo periodo,
            @Param("nome") String nome
    );
}
