package grupo10.tpo.demo.exception.usuario;

public class UsuarioNotFoundException extends RuntimeException {
    public UsuarioNotFoundException(Long id) {
        super("No se encontró el usuario con id: " + id);
    }

    // Constructor: Acepta cualquier String como mensaje.
    public UsuarioNotFoundException(String message) {
        super(message);
    }
    
}
