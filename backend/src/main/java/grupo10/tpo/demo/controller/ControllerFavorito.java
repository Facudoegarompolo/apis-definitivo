package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.producto.ProductoResponse;
import grupo10.tpo.demo.service.FavoritoService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
public class ControllerFavorito {

    private final FavoritoService favoritoService;

    public ControllerFavorito(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public List<ProductoResponse> getFavoritos(Authentication authentication) {
        return favoritoService.getFavoritos(authentication.getName());
    }

    @PostMapping("/{productoId}")
    public List<ProductoResponse> agregar(
            Authentication authentication,
            @PathVariable Long productoId) {
        return favoritoService.agregar(authentication.getName(), productoId);
    }

    @DeleteMapping("/{productoId}")
    public List<ProductoResponse> eliminar(
            Authentication authentication,
            @PathVariable Long productoId) {
        return favoritoService.eliminar(authentication.getName(), productoId);
    }
}
