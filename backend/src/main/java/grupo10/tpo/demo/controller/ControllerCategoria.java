package grupo10.tpo.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import grupo10.tpo.demo.service.CategoriaService;
import grupo10.tpo.demo.dto.categoria.CategoriaRequest;
import grupo10.tpo.demo.dto.categoria.CategoriaResponse;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class ControllerCategoria {

    private final CategoriaService categoriaService;

    public ControllerCategoria(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<CategoriaResponse> getAllCategorias() {
        return categoriaService.getAllCategorias();
    }

    @GetMapping("/{id}")
    public CategoriaResponse getCategoriaById(@PathVariable Long id) {
        return categoriaService.getCategoriaById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CategoriaResponse crearCategoria(@RequestBody CategoriaRequest req) {
        return categoriaService.save(req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return "Categoria eliminada exitosamente";
    }
}
