package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.producto.ProductoRequest;
import grupo10.tpo.demo.dto.producto.ProductoResponse;
import grupo10.tpo.demo.service.ProductoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/productos")
public class ControllerProducto {

    @Autowired
    private ProductoService productoService;

    ControllerProducto(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductoResponse> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/{id}")
    public ProductoResponse getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id);
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoResponse> getProductosByCategoriaId(@PathVariable Long categoriaId) {
        return productoService.getProductosByCategoriaId(categoriaId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProductoResponse crearProducto(@RequestBody ProductoRequest req) {
        return productoService.crearProductoConCategorias(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProductoResponse actualizarProducto(@PathVariable Long id, @RequestBody ProductoRequest req) {
        return productoService.actualizarProducto(id, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

}
