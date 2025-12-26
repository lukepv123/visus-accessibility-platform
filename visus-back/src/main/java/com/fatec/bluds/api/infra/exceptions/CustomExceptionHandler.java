package com.fatec.bluds.api.infra.exceptions;

import com.fatec.bluds.api.infra.exceptions.comentario.ComentarioNotFoundException;
import com.fatec.bluds.api.infra.exceptions.disciplina.DisciplinaNotFoundException;
import com.fatec.bluds.api.infra.exceptions.general.UnauthorizedActionException;
import com.fatec.bluds.api.infra.exceptions.instituicao.InstituicaoNotFoundException;
import com.fatec.bluds.api.infra.exceptions.perfilacessibilidade.PerfilAcessibilidadeNotFoundException;
import com.fatec.bluds.api.infra.exceptions.postagem.PostagemNotFoundException;
import com.fatec.bluds.api.infra.exceptions.usuario.UsuarioNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    /*
    @ExceptionHandler(RuntimeException.class)
    private ResponseEntity<String> handleBaseException(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao processar requisição");
    }
     */

    @ExceptionHandler(UsuarioNotFoundException.class)
    private ResponseEntity<String> handleUsuarioNotFoundException(UsuarioNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(InstituicaoNotFoundException.class)
    private ResponseEntity<String> handleInstituicaoNotFoundException(InstituicaoNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    private ResponseEntity<String> handleIllegalStateException(IllegalStateException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
    }

    @ExceptionHandler(DisciplinaNotFoundException.class)
    private ResponseEntity<String> handleDisciplinaNotFoundException(DisciplinaNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    private ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    private ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Dados inválidos ou já existentes no banco de dados");
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    private ResponseEntity<String> handleUnauthorizedActionException(UnauthorizedActionException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
    }

    @ExceptionHandler(PostagemNotFoundException.class)
    private ResponseEntity<String> handlePostagemNotFoundException(PostagemNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(ComentarioNotFoundException.class)
    private ResponseEntity<String> handleComentarioNotFoundException(ComentarioNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler(PerfilAcessibilidadeNotFoundException.class)
    private ResponseEntity<String> handlePerfilAcessibilidadeNotFoundException(PerfilAcessibilidadeNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }
}
