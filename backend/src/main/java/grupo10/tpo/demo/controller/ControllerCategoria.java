package grupo10.tpo.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import grupo10.tpo.demo.service.CategoriaService;
import grupo10.tpo.demo.dto.categoria.CategoriaRequest;
import grupo10.tpo.demo.dto.categoria.CategoriaResponse;
import grupo10.tpo.demo.model.Categoria;  

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class ControllerCategoria {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaService.getAllCategorias();
    }

    @GetMapping("/{id}")
    public CategoriaResponse getCategoriaById(@PathVariable Long id) {
        return categoriaService.getCategoriaById(id);
    }

    @PostMapping
    public CategoriaResponse crearCategoria(@RequestBody CategoriaRequest req) {
        return categoriaService.save(req);
    }

    @DeleteMapping("/{id}")
    public String eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return "Categoria eliminada exitosamente";
    }
}