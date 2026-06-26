package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.marca.MarcaRequest;
import grupo10.tpo.demo.dto.marca.MarcaResponse;
import grupo10.tpo.demo.service.MarcaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class ControllerMarca {

    private final MarcaService marcaService;

    public ControllerMarca(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    public List<MarcaResponse> getAllMarcas() {
        return marcaService.getAllMarcas();
    }

    @GetMapping("/{id}")
    public MarcaResponse getMarcaById(@PathVariable Long id) {
        return marcaService.getMarcaById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MarcaResponse crearMarca(@RequestBody MarcaRequest req) {
        return marcaService.crearMarca(req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarMarca(@PathVariable Long id) {
        marcaService.eliminarMarca(id);
    }
}
