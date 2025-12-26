package com.fatec.bluds.api.domain.usuario.controller;

import com.fatec.bluds.api.domain.usuario.dto.*;
import com.fatec.bluds.api.domain.usuario.service.AuthenticationService;
import com.fatec.bluds.api.domain.usuario.model.Usuario;
import com.fatec.bluds.api.infra.security.token.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("auth")
@Tag(name = "Authentication", description = "Responsável autenticação e registro de usuários")
public class AuthenticationController {
    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Operation(summary = "Realiza a autenticação de usuários", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",  description = "Usuário autenticado com sucesso"),
            @ApiResponse(responseCode = "400",  description = "Requisição tem parâmetros inválidos"),
    })
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDTO dto) {

        var auth = this.authenticationService.authenticate(dto, authenticationManager);

        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token, new UsuarioDetailsDTO((Usuario) auth.getPrincipal())));
    }

    @Operation(summary = "Realiza o registro de usuários", method = "POST")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",  description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400",  description = "Requisição tem parâmetros inválidos"),
    })
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody @Valid RegisterDTO dto, UriComponentsBuilder uriBuilder) {
        Usuario usuario = authenticationService.register(dto);

        var uri = uriBuilder
                .path("/user/{id}")
                .buildAndExpand(usuario.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new UsuarioDetailsDTO(usuario));
    }
}
