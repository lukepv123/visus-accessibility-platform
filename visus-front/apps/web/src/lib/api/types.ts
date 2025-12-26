// API Response Types

import type { Endereco } from "@visus/api";

export interface InstituicaoDetailsDTO {
    id: number;
    nome: string;
    email: string;
    cnpj: string;
    telefone: string;
    endereco: Endereco;
}

export interface UsuarioDetailsDTO {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    genero: string;
    dataNascimento: string;
    instituicao: InstituicaoDetailsDTO | null;
    roles: string[];
}

export interface LoginResponseDTO {
    token: string;
    usuario: UsuarioDetailsDTO;
}

export interface AuthenticationDTO {
    email: string;
    senha: string;
}

export enum UserTypeEnum {
    ESTUDANTE = "ESTUDANTE",
    EDUCADOR = "EDUCADOR",
    GESTOR = "GESTOR",
}

export enum Genero {
    MASCULINO = "MASCULINO",
    FEMININO = "FEMININO",
    OUTRO = "OUTRO",
}

export enum Periodo {
    MATUTINO = "MATUTINO",
    VESPERTINO = "VESPERTINO",
    NOTURNO = "NOTURNO",
}

export enum AnoEscolar {
    PRIMEIRO_ANO = "PRIMEIRO_ANO",
    SEGUNDO_ANO = "SEGUNDO_ANO",
    TERCEIRO_ANO = "TERCEIRO_ANO",
}

export interface RegisterDTO {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    genero: Genero;
    dataNascimento: string;
    senha: string;
    userType: UserTypeEnum;
    matricula?: string;
    titulo?: string;
    periodo?: Periodo;
    anoEscolar?: AnoEscolar;
    cargo?: string;
}

export interface ApiError {
    status: number;
    message: string;
    error?: string;
}
