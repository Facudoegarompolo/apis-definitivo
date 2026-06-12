package grupo10.tpo.demo.service;

import grupo10.tpo.demo.dto.carrito.CartItemRequest;
import grupo10.tpo.demo.dto.carrito.CartItemResponse;
import grupo10.tpo.demo.dto.carrito.CarritoResponse;
import grupo10.tpo.demo.exception.producto.ProductoNotFoundException;
import grupo10.tpo.demo.exception.usuario.UsuarioNotFoundException;
import grupo10.tpo.demo.model.Carrito;
import grupo10.tpo.demo.model.CarritoItem;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.model.Usuario;
import grupo10.tpo.demo.repository.CarritoItemRepository;
import grupo10.tpo.demo.repository.CarritoRepository;
import grupo10.tpo.demo.repository.ProductoRepository;
import grupo10.tpo.demo.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public CarritoService(CarritoRepository carritoRepository,
                          CarritoItemRepository carritoItemRepository,
                          UsuarioRepository usuarioRepository,
                          ProductoRepository productoRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoItemRepository = carritoItemRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public CarritoResponse getCarritoByUsuario(Long usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        return toResponse(carrito);
    }

    public CarritoResponse agregarItem(Long usuarioId, CartItemRequest request) {
        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0");
        }

        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ProductoNotFoundException("Producto no encontrado: " + request.getProductoId()));

        CarritoItem item = carritoItemRepository.findByCarritoAndProducto_Id(carrito, producto.getId())
                .orElseGet(() -> {
                    CarritoItem nuevo = new CarritoItem();
                    nuevo.setCarrito(carrito);
                    nuevo.setProducto(producto);
                    nuevo.setCantidad(0);
                    carrito.getItems().add(nuevo);
                    return nuevo;
                });

        item.setCantidad(item.getCantidad() + request.getCantidad());
        carritoRepository.save(carrito);
        return toResponse(carrito);
    }

    public CarritoResponse actualizarCantidad(Long usuarioId, Long productoId, CartItemRequest request) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        CarritoItem item = carritoItemRepository.findByCarritoAndProducto_Id(carrito, productoId)
                .orElseThrow(() -> new RuntimeException("El producto no existe en el carrito"));

        if (request.getCantidad() == null || request.getCantidad() <= 0) {
            carrito.getItems().remove(item);
            carritoItemRepository.delete(item);
        } else {
            item.setCantidad(request.getCantidad());
        }

        carritoRepository.save(carrito);
        return toResponse(carrito);
    }

    public CarritoResponse eliminarItem(Long usuarioId, Long productoId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        CarritoItem item = carritoItemRepository.findByCarritoAndProducto_Id(carrito, productoId)
                .orElseThrow(() -> new RuntimeException("El producto no existe en el carrito"));

        carrito.getItems().remove(item);
        carritoItemRepository.delete(item);
        carritoRepository.save(carrito);

        return toResponse(carrito);
    }

    public void vaciarCarrito(Long usuarioId) {
        Carrito carrito = obtenerOCrearCarrito(usuarioId);
        List<CarritoItem> copia = new ArrayList<>(carrito.getItems());
        carrito.getItems().clear();
        carritoItemRepository.deleteAll(copia);
        carritoRepository.save(carrito);
    }

    private Carrito obtenerOCrearCarrito(Long usuarioId) {
        return carritoRepository.findByUsuario_Id(usuarioId)
                .orElseGet(() -> {
                    Usuario usuario = usuarioRepository.findById(usuarioId)
                            .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));
                    Carrito nuevo = new Carrito();
                    nuevo.setUsuario(usuario);
                    return carritoRepository.save(nuevo);
                });
    }

    private CarritoResponse toResponse(Carrito carrito) {
        List<CartItemResponse> items = carrito.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getProducto().getId(),
                        item.getProducto().getNombre(),
                        item.getProducto().getPrecio(),
                        item.getCantidad(),
                        item.getProducto().getPrecio() * item.getCantidad()
                ))
                .toList();

        Double total = items.stream()
                .mapToDouble(CartItemResponse::getSubtotal)
                .sum();

        return new CarritoResponse(
                carrito.getId(),
                carrito.getUsuario().getId(),
                items,
                total
        );
    }
}
