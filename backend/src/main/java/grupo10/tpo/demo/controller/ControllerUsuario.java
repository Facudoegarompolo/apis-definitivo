package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.usuario.AuthResponse;
import grupo10.tpo.demo.dto.usuario.UsuarioRegistroRequest;
import grupo10.tpo.demo.dto.usuario.UsuarioResponse;
import grupo10.tpo.demo.service.UsuarioService;
import grupo10.tpo.demo.security.JwtCookieService;
import grupo10.tpo.demo.security.LoginRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class ControllerUsuario {

    private final UsuarioService usuarioService;
    private final JwtCookieService jwtCookieService;

    public ControllerUsuario(UsuarioService usuarioService, JwtCookieService jwtCookieService) {
        this.usuarioService = usuarioService;
        this.jwtCookieService = jwtCookieService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UsuarioResponse> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public UsuarioResponse getUsuario(@PathVariable Long id) {
        return usuarioService.getUser(id);
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrarUsuario(@Valid @RequestBody UsuarioRegistroRequest request) {
        AuthResponse response = usuarioService.registrarUsuario(request);
        return withAuthCookie(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = usuarioService.login(request);
        return withAuthCookie(response);
    }

    @GetMapping("/me")
    public UsuarioResponse getAuthenticatedUser(Authentication authentication) {
        return usuarioService.getUserByEmail(authentication.getName());
    }

    @GetMapping("/csrf")
    public CsrfToken getCsrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, jwtCookieService.deleteCookie().toString())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<AuthResponse> withAuthCookie(AuthResponse response) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookieService.createCookie(response.getToken()).toString())
                .body(response);
    }
}
