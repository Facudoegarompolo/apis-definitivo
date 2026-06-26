package grupo10.tpo.demo;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void contextLoads() {
    }

    @Test
    void authenticationCookieAndCsrfWorkTogether() throws Exception {
        MvcResult registerResult = mockMvc.perform(post("/api/usuarios/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Integration Test",
                                  "email": "integration@test.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").doesNotExist())
                .andReturn();

        Cookie authenticationCookie = registerResult.getResponse().getCookie("access_token");
        assertThat(authenticationCookie).isNotNull();
        assertThat(authenticationCookie.isHttpOnly()).isTrue();

        MvcResult csrfResult = mockMvc.perform(get("/api/usuarios/csrf")
                        .cookie(authenticationCookie))
                .andExpect(status().isOk())
                .andReturn();

        Cookie csrfCookie = csrfResult.getResponse().getCookie("XSRF-TOKEN");
        assertThat(csrfCookie).isNotNull();

        mockMvc.perform(get("/api/usuarios/me")
                        .cookie(authenticationCookie, csrfCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("integration@test.com"));

        mockMvc.perform(post("/api/usuarios/logout")
                        .cookie(authenticationCookie, csrfCookie))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/usuarios/logout")
                        .cookie(authenticationCookie, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isNoContent());
    }
}
