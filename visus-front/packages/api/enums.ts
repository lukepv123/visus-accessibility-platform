// apps/web/src/api/enums.ts

// OpenAPI: RegisterDTO.genero enum
export const GENERO = [
    "MASCULINO",
    "FEMININO",
    "OUTRO",
    "NAO_INFORMAR",
] as const;
export type Genero = (typeof GENERO)[number];

// OpenAPI: RegisterDTO.periodo enum
export const PERIODO = ["MATUTINO", "VESPERTINO", "NOTURNO"] as const;
export type Periodo = (typeof PERIODO)[number];

// OpenAPI: RegisterDTO.anoEscolar enum
// Atenção: no OpenAPI há "PRIMEIO_ANO_EM" (provável typo), mantenha igual ao backend!
export const ANO_ESCOLAR = [
    "PRIMEIRO_ANO",
    "SEGUNDO_ANO",
    "TERCEIRO_ANO",
    "QUARTO_ANO",
    "QUINTO_ANO",
    "SEXTO_ANO",
    "SETIMO_ANO",
    "OITAVO_ANO",
    "NONO_ANO",
    "PRIMEIO_ANO_EM",
    "SEGUNDO_ANO_EM",
    "TERCEIRO_ANO_EM",
] as const;
export type AnoEscolar = (typeof ANO_ESCOLAR)[number];

// OpenAPI: RegisterDTO.userType enum
export const USER_TYPE = ["ESTUDANTE", "EDUCADOR", "GESTOR"] as const;
export type UserType = (typeof USER_TYPE)[number];
