package grupo10.tpo.demo;

import grupo10.tpo.demo.model.Categoria;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.repository.CategoriaRepository;
import grupo10.tpo.demo.repository.ProductoRepository;
import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
class FavoritoIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void categoriesCanBeReadWithoutAuthentication() throws Exception {
        Categoria categoria = new Categoria();
        categoria.setNombre("Categoria publica");
        categoriaRepository.save(categoria);

        mockMvc.perform(get("/api/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].nombre", hasItem("Categoria publica")));
    }

    @Test
    void favoritesPersistForTheAuthenticatedUser() throws Exception {
        Producto producto = new Producto();
        producto.setNombre("Producto favorito");
        producto.setDescripcion("Producto de prueba");
        producto.setPrecio(1000.0);
        producto.setStock(2);
        producto.setCategorias(List.of());
        producto = productoRepository.save(producto);

        MvcResult registerResult = mockMvc.perform(post("/api/usuarios/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Usuario Favoritos",
                                  "email": "favoritos@test.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        Cookie authenticationCookie = registerResult.getResponse().getCookie("access_token");
        assertThat(authenticationCookie).isNotNull();

        MvcResult csrfResult = mockMvc.perform(get("/api/usuarios/csrf")
                        .cookie(authenticationCookie))
                .andExpect(status().isOk())
                .andReturn();

        Cookie csrfCookie = csrfResult.getResponse().getCookie("XSRF-TOKEN");
        assertThat(csrfCookie).isNotNull();

        mockMvc.perform(post("/api/favoritos/{productoId}", producto.getId())
                        .cookie(authenticationCookie, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(producto.getId()));

        mockMvc.perform(post("/api/favoritos/{productoId}", producto.getId())
                        .cookie(authenticationCookie, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(get("/api/favoritos")
                        .cookie(authenticationCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Producto favorito"));

        mockMvc.perform(delete("/api/favoritos/{productoId}", producto.getId())
                        .cookie(authenticationCookie, csrfCookie)
                        .header("X-XSRF-TOKEN", csrfCookie.getValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
