package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.usuario.AuthResponse;
import grupo10.tpo.demo.dto.usuario.UsuarioResponse;
import grupo10.tpo.demo.security.JwtCookieService;
import grupo10.tpo.demo.security.LoginRequest;
import grupo10.tpo.demo.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ControllerUsuarioTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private JwtCookieService jwtCookieService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        ControllerUsuario controller = new ControllerUsuario(usuarioService, jwtCookieService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void loginSetsCookieWithoutExposingJwtInBody() throws Exception {
        UsuarioResponse usuario = new UsuarioResponse(1L, "Usuario", "user@test.com");
        AuthResponse authResponse = new AuthResponse("signed-jwt", usuario);
        ResponseCookie cookie = ResponseCookie.from(JwtCookieService.COOKIE_NAME, "signed-jwt")
                .httpOnly(true)
                .path("/")
                .sameSite("Lax")
                .build();

        when(usuarioService.login(any(LoginRequest.class))).thenReturn(authResponse);
        when(jwtCookieService.createCookie("signed-jwt")).thenReturn(cookie);

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"user@test.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", cookie.toString()))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.usuario.email").value("user@test.com"));
    }

    @Test
    void logoutExpiresAuthenticationCookie() throws Exception {
        ResponseCookie expiredCookie = ResponseCookie.from(JwtCookieService.COOKIE_NAME, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();

        when(jwtCookieService.deleteCookie()).thenReturn(expiredCookie);

        mockMvc.perform(post("/api/usuarios/logout"))
                .andExpect(status().isNoContent())
                .andExpect(header().string("Set-Cookie", containsString("access_token=")))
                .andExpect(header().string("Set-Cookie", containsString("Max-Age=0")))
                .andExpect(header().string("Set-Cookie", containsString("HttpOnly")))
                .andExpect(content().string(""));
    }
}
