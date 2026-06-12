package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.carrito.CartItemRequest;
import grupo10.tpo.demo.dto.carrito.CarritoResponse;
import grupo10.tpo.demo.service.CarritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "http://localhost:5173")
public class ControllerCarrito {

    private final CarritoService carritoService;

    public ControllerCarrito(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping("/{usuarioId}")
    public CarritoResponse getCarrito(@PathVariable Long usuarioId) {
        return carritoService.getCarritoByUsuario(usuarioId);
    }

    @PostMapping("/{usuarioId}/items")
    public CarritoResponse agregarItem(@PathVariable Long usuarioId, @RequestBody CartItemRequest request) {
        return carritoService.agregarItem(usuarioId, request);
    }

    @PutMapping("/{usuarioId}/items/{productoId}")
    public CarritoResponse actualizarCantidad(@PathVariable Long usuarioId,
                                              @PathVariable Long productoId,
                                              @RequestBody CartItemRequest request) {
        return carritoService.actualizarCantidad(usuarioId, productoId, request);
    }

    @DeleteMapping("/{usuarioId}/items/{productoId}")
    public CarritoResponse eliminarItem(@PathVariable Long usuarioId, @PathVariable Long productoId) {
        return carritoService.eliminarItem(usuarioId, productoId);
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> vaciarCarrito(@PathVariable Long usuarioId) {
        carritoService.vaciarCarrito(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
