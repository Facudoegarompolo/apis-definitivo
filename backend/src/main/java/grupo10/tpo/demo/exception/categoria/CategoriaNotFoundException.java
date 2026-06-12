package grupo10.tpo.demo.exception.categoria;

public class CategoriaNotFoundException extends RuntimeException {
    public CategoriaNotFoundException(Long id) {
        super("No se encontró la categoría con id: " + id);
    }
}