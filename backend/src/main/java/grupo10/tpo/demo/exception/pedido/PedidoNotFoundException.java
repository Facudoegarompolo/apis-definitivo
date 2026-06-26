package grupo10.tpo.demo.exception.pedido;

public class PedidoNotFoundException extends RuntimeException {
    public PedidoNotFoundException(Long id) {
        super("No se encontró el pedido con id: " + id);
    }
}