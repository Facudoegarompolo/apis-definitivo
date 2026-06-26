package grupo10.tpo.demo.controller;

import grupo10.tpo.demo.dto.carrito.CartItemRequest;
import grupo10.tpo.demo.dto.carrito.CarritoResponse;
import grupo10.tpo.demo.service.CarritoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/carrito")
public class ControllerCarrito {

    private final CarritoService carritoService;

    public ControllerCarrito(CarritoService carritoService) {
        this.carritoService = carritoService;
    }

    @GetMapping
    public CarritoResponse getCarrito(Authentication authentication) {
        return carritoService.getCarrito(authentication.getName());
    }

    @PostMapping("/items")
    public CarritoResponse agregarItem(
            Authentication authentication,
            @RequestBody CartItemRequest request) {

        return carritoService.agregarItem(authentication.getName(), request);
    }

    @PutMapping("/items/{productoId}")
    public CarritoResponse actualizarCantidad(
            Authentication authentication,
            @PathVariable Long productoId,
            @RequestBody CartItemRequest request) {

        return carritoService.actualizarCantidad(
                authentication.getName(),
                productoId,
                request);
    }

    @DeleteMapping("/items/{productoId}")
    public CarritoResponse eliminarItem(
            Authentication authentication,
            @PathVariable Long productoId) {

        return carritoService.eliminarItem(
                authentication.getName(),
                productoId);
    }

    @DeleteMapping
    public ResponseEntity<Void> vaciarCarrito(Authentication authentication) {
        carritoService.vaciarCarrito(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}