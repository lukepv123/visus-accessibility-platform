package com.fatec.bluds.api.domain.passwordreset.controller;

import com.fatec.bluds.api.domain.passwordreset.dto.PasswordResetDTO;
import com.fatec.bluds.api.domain.passwordreset.dto.RequestResetDTO;
import com.fatec.bluds.api.domain.passwordreset.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reset-password")
@Tag(name = "Redefinição de Senha", description = "Responsável por solicitar e efetuar a redefinição da senha do usuáro")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @Operation(summary = "Solicita redefinição de senha através do e-mail", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "Caso o e-mail existir, será enviado um link com token de redefinição"),
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<Object> forgotPassword(@RequestBody @Valid RequestResetDTO dto) throws MessagingException {
        passwordResetService.processRequest(dto);

        return ResponseEntity.ok().body("Se o e-mail estiver cadastrado, você receberá instruções de redefinição de senha.");
    }

    @Operation(summary = "Valida o token enviado através do email", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "O token é válido"),
            @ApiResponse(responseCode = "400",  description = "O token não é válido")
    })
    @PostMapping("/validate")
    public ResponseEntity<Object> validateToken(@RequestParam String token) {
        if (passwordResetService.validateToken(token)) {
            return ResponseEntity.ok().body("Token é válida.");
        } else {
            return ResponseEntity.badRequest().body("Token é inválida.");
        }
    }

    @Operation(summary = "Recebe o token e senha nova do usuário para redefiní-la", method = "PUT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "A senha é alterada com sucesso"),
            @ApiResponse(responseCode = "400",  description = "Não foi possível atualizar a senha")
    })
    @PutMapping()
    public ResponseEntity<Object> updatePassword(@RequestBody PasswordResetDTO dto) {
        if (passwordResetService.updatePassword(dto)) {
            return ResponseEntity.ok().body("Senha atualizada com sucesso.");
        } else {
            return ResponseEntity.badRequest().body("Falha ao atualizar senha");
        }
    }
}
