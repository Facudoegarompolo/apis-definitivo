package grupo10.tpo.demo.exception.producto;

public class PrecioNegativoException extends IllegalArgumentException {
    public PrecioNegativoException() {
        super("El precio no puede ser negativo");
    }
}
