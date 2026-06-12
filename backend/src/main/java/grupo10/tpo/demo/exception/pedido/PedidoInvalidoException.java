package grupo10.tpo.demo.exception.pedido;

public class PedidoInvalidoException extends RuntimeException {
    public PedidoInvalidoException(String message) {
        super(message);
    }
}