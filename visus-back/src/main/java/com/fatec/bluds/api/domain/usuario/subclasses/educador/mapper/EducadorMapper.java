package com.fatec.bluds.api.domain.usuario.subclasses.educador.mapper;

import com.fatec.bluds.api.domain.usuario.subclasses.educador.dto.*;
import com.fatec.bluds.api.domain.usuario.subclasses.educador.model.*;
import org.mapstruct.*;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface EducadorMapper {

    // Entity → DTO
    @Mappings({
            @Mapping(target = "formacaoAcademica", source = "formacoes") // ✅ nome do contrato
    })
    EducadorResponseDTO toDTO(Educador educador);

    FormacaoResponseDTO toDTO(Formacao formacao);

    // DTO → Entity
    Formacao toEntity(FormacaoRequestDTO dto);

    // Listas
    List<FormacaoResponseDTO> toDTOList(List<Formacao> formacoes);

    // Opcional:  mapear Set direto
    List<FormacaoResponseDTO> toDTOListFromSet(Set<Formacao> formacoes);
}
