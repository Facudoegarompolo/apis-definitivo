package grupo10.tpo.demo.service;

import grupo10.tpo.demo.dto.pedido.ItemPedidoResponse;
import grupo10.tpo.demo.dto.pedido.PedidoRequest;
import grupo10.tpo.demo.dto.pedido.PedidoResponse;
import grupo10.tpo.demo.model.Pedido;
import grupo10.tpo.demo.model.Producto;
import grupo10.tpo.demo.model.Usuario;
import grupo10.tpo.demo.repository.PedidoRepository;
import grupo10.tpo.demo.repository.ProductoRepository;
import grupo10.tpo.demo.repository.UsuarioRepository;
import grupo10.tpo.demo.exception.usuario.UsuarioNotFoundException;
import grupo10.tpo.demo.exception.producto.ProductoNotFoundException;

import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.ArrayList;

@Service
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         UsuarioRepository usuarioRepository,
                         ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public PedidoResponse crearPedido(PedidoRequest request) {

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDireccionEnvio(request.getDireccionEnvio());
        pedido.setEstado("PENDIENTE");

        List<Producto> productosFinales = new ArrayList<>();

        for (var item : request.getItems()) {

            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new ProductoNotFoundException(
                            "Producto no encontrado: " + item.getProductoId()
                    ));

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException(
                        "Stock insuficiente para producto: " + producto.getNombre()
                );
            }

            producto.setStock(producto.getStock() - item.getCantidad());

            for (int i = 0; i < item.getCantidad(); i++) {
                productosFinales.add(producto);
            }
        }

        pedido.setProductos(productosFinales);

        Pedido guardado = pedidoRepository.save(pedido);

        return toResponse(guardado);
    }

    public List<PedidoResponse> getAllPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PedidoResponse getPedidoById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        return toResponse(pedido);
    }

    public void eliminarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedidoRepository.delete(pedido);
    }

private PedidoResponse toResponse(Pedido pedido) {

    java.util.Map<Long, Integer> contador = new java.util.HashMap<>();

    for (Producto p : pedido.getProductos()) {
        contador.put(p.getId(), contador.getOrDefault(p.getId(), 0) + 1);
    }

    List<ItemPedidoResponse> items = contador.entrySet()
            .stream()
            .map(e -> {
                Long productoId = e.getKey();
                Integer cantidad = e.getValue();
                Producto producto = productoRepository.findById(productoId)
                        .orElseThrow(() -> new ProductoNotFoundException(
                                "Producto no encontrado: " + productoId
                        ));
                return new ItemPedidoResponse(productoId, producto.getNombre(), cantidad);
            })
            .toList();

    return new PedidoResponse(
            pedido.getId(),
            pedido.getUsuario().getId(),
            items,
            pedido.getEstado(),
            pedido.getDireccionEnvio()
    );
}

}